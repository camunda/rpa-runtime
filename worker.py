import asyncio
import os
import signal
from scripts.rest import ServerManager
from scripts.zeebe import ZeebeWorkerManager
from dotenv import load_dotenv


class ApplicationManager:
    def __init__(self, client_id, client_secret, cluster_id):
        self.worker_manager = None
        self.rest_server = None
        self.client_id = client_id
        self.client_secret = client_secret
        self.cluster_id = cluster_id

    async def shutdown(self):
        # Shut down the server and the worker
        if self.rest_server:
            self.rest_server.shutdown()
        if self.worker_manager:
            self.worker_manager.shutdown()

    def add_shutdown_listener(self):
        loop = asyncio.get_event_loop()

        def _shutdown_handler():
            asyncio.create_task(self.shutdown())

        for signal_name in {"SIGINT", "SIGTERM", "SIGBREAK"}:
            if hasattr(signal, signal_name):
                try:
                    loop.add_signal_handler(
                        getattr(signal, signal_name), _shutdown_handler
                    )
                except NotImplementedError:
                    # Add signal handler may not be implemented on Windows
                    signal.signal(getattr(signal, signal_name), _shutdown_handler)

    async def start(self):
        self.add_shutdown_listener()

        tasks = []

        if os.getenv("ENABLE_WORKER") == "true":
            self.worker_manager = ZeebeWorkerManager(
                self.client_id, self.client_secret, self.cluster_id
            )
            worker_task = asyncio.create_task(self.worker_manager.start())
            tasks.append(worker_task)

        if os.getenv("ENABLE_REST") == "true":
            self.rest_server = ServerManager(self.worker_manager)
            server_task = asyncio.create_task(
                self.rest_server.start(port=os.getenv("PORT"))
            )
            tasks.append(server_task)

        await asyncio.gather(*tasks)


if __name__ == "__main__":
    # Load environment variables from .env file
    load_dotenv()

    # Get environment variables
    client_id = os.getenv("ZEEBE_CLIENT_ID")
    client_secret = os.getenv("ZEEBE_CLIENT_SECRET")
    cluster_id = os.getenv("CAMUNDA_CLUSTER_ID")

    app_manager = ApplicationManager(client_id, client_secret, cluster_id)

    try:
        asyncio.run(app_manager.start())
    except KeyboardInterrupt:
        print("Keyboard interrupt")
    finally:
        print("Done")
