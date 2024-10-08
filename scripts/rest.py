from quart import Quart, request, json, jsonify
import os
import io
import asyncio
from werkzeug.exceptions import HTTPException
from datetime import datetime

import traceback

from scripts.constants import RPA_SCRIPTS_FOLDER
from scripts.rpa import run_robot_task
from scripts.zeebe import ZeebeWorkerManager
from scripts.Secrets import SecretsManager


class ServerManager:
    def __init__(self, zeebe_worker_manager: ZeebeWorkerManager):
        self.app = Quart(__name__)
        self.zeebe_worker_manager = zeebe_worker_manager
        self.shutdown_event = asyncio.Event()
        self.setup_routes()

    def setup_routes(self):

        @self.app.errorhandler(HTTPException)
        def handle_exception(e):
            """Return JSON instead of HTML for HTTP errors."""
            # start with the correct headers and status code from the error
            return (
                jsonify(
                    variables={},
                    stdOut=f"The RPA runtime encountered an error, please check the logs.\n{e.description}",
                ),
                e.code,
            )

        @self.app.route("/run", methods=["POST"])
        async def run():
            data = await request.get_json()

            script = data.get("script")
            script_id = data.get("id") or "default"
            variables = data.get("variables") or {}

            currentTime = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")

            try:
                output = await run_robot_task(
                    script=script,
                    variables=variables,
                    secrets_manager=self.secrets_manager,
                    workingdir=f"workers/manual_run/{script_id}/{currentTime}",
                )
            except Exception as e:
                print(e)
                return jsonify({"stdOut": str(e), "log": None, "variables": "null"})

            return jsonify(
                variables=output.get("variables"),
                stdOut=output.get("stdOut"),
                log=get_file_content(output.get("logPath")),
                logPath=output.get("logPath"),
            )

        @self.app.route("/deploy", methods=["POST"])
        async def deploy():
            data = await request.get_json()
            script = data.get("script")
            script_id = data.get("id")
            script_path = os.path.join(RPA_SCRIPTS_FOLDER, f"{script_id}.robot")
            with open(script_path, "w") as file:
                file.write(script)

            await self.zeebe_worker_manager.update()  # Use the zeebe_worker_manager instance
            return jsonify({"message": "Script deployed.", "path": script_path})

        @self.app.route("/status", methods=["GET"])
        async def status():
            return jsonify({"status": "up"}), 200

    def shutdown(self):
        self.shutdown_event.set()

    async def shutdown_trigger(self):
        await self.shutdown_event.wait()
        print("Server shutting down")

    async def start(self, port=36227):
        print("Starting server")
        self.secrets_manager = SecretsManager()

        host = os.getenv("HOST", "127.0.0.1")

        await self.app.run_task(
            host=host, port=port, shutdown_trigger=self.shutdown_trigger
        )
        print("Server done")


# Usage example
if __name__ == "__main__":
    # Get environment variables
    client_id = os.getenv("ZEEBE_CLIENT_ID")
    client_secret = os.getenv("ZEEBE_CLIENT_SECRET")
    cluster_id = os.getenv("CAMUNDA_CLUSTER_ID")

    # Create an instance of ZeebeWorkerManager
    zeebe_worker_manager = ZeebeWorkerManager(client_id, client_secret, cluster_id)

    # Create an instance of Component
    component = ServerManager(zeebe_worker_manager)

    # Run the server
    asyncio.run(component.start_server())


def get_file_content(path):
    print(path)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="UTF8") as file:
        return file.read()
