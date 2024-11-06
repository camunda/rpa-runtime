import asyncio
import os
from pyzeebe import ZeebeWorker, create_camunda_cloud_channel

from scripts.constants import RPA_SCRIPTS_FOLDER
from scripts.tasks import create_router
from scripts.Secrets import SecretsManager

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ZeebeWorkerManager:

    def __init__(
        self, client_id=None, client_secret=None, cluster_id=None, region=None
    ):
        self.client_id = client_id or os.getenv("ZEEBE_CLIENT_ID")
        self.client_secret = client_secret or os.getenv("ZEEBE_CLIENT_SECRET")
        self.cluster_id = cluster_id or os.getenv("CAMUNDA_CLUSTER_ID")
        self.region = region or os.getenv("CAMUNDA_CLUSTER_REGION")
        self.worker = None
        self.channel = None
        self.shutdown_event = asyncio.Event()

        self.secrets_manager = SecretsManager(
            client_id=client_id, client_secret=client_secret
        )

        # Throw error message if environment variables are not set
        if not self.client_id or not self.client_secret or not self.cluster_id:
            raise Exception(
                "The Environment variables ZEEBE_CLIENT_ID, ZEEBE_CLIENT_SECRET, and CAMUNDA_CLUSTER_ID must be set."
            )
        self.observer = Observer()
        self.observer.schedule(
            FileChangeHandler(self, asyncio.get_event_loop()),
            path=RPA_SCRIPTS_FOLDER,
            recursive=True,
        )
        self.observer.start()

    async def update(self):
        print("Updating topics")

        if not self.channel:
            return

        if self.worker:
            await self.worker.stop()
            print("Worker stopped")

        router = create_router(self.secrets_manager)
        self.worker = ZeebeWorker(self.channel)
        self.worker.include_router(router)

        print("Worker started")
        asyncio.create_task(self.worker.work())

    def shutdown(self):
        self.shutdown_event.set()

    async def shutdown_trigger(self):
        await self.shutdown_event.wait()
        if self.worker:
            await self.worker.stop()
        self.observer.stop()
        self.observer.join()

        print("Worker stopped")

    async def start(self):
        print("Starting worker")
        self.channel = create_camunda_cloud_channel(
            self.client_id, self.client_secret, self.cluster_id, self.region
        )

        await self.update()

        await self.shutdown_trigger()

        print("Worker ended")


# Watchdog event handler to detect file changes
class FileChangeHandler(FileSystemEventHandler):
    def __init__(self, worker_manager, loop):
        self.worker_manager = worker_manager
        self._loop = loop or asyncio.get_event_loop()
        self.update_scheduled = False

    # This ensures we do not update multiple times for the same event
    def schedule_update(self):
        if not self.update_scheduled:
            self.update_scheduled = True
            self._loop.call_later(0.1, self.run_update)

    def run_update(self):
        self.update_scheduled = False
        asyncio.create_task(self.worker_manager.update())

    def on_modified(self, event):
        if not event.is_directory:
            print(f"File {event.src_path} modified. Updating worker...")
            self.schedule_update()

    def on_created(self, event):
        if not event.is_directory:
            print(f"File {event.src_path} created. Updating worker...")
            self.schedule_update()

    def on_deleted(self, event):
        if not event.is_directory:
            print(f"File {event.src_path} deleted. Updating worker...")
            self.schedule_update()


# Usage example
if __name__ == "__main__":
    client_id = os.getenv("ZEEBE_CLIENT_ID")
    client_secret = os.getenv("ZEEBE_CLIENT_SECRET")
    cluster_id = os.getenv("CAMUNDA_CLUSTER_ID")

    worker_manager = ZeebeWorkerManager(client_id, client_secret, cluster_id)

    try:
        asyncio.run(worker_manager.start())
    except KeyboardInterrupt:
        pass
