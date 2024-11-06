import robot
import sys
import os
import io
import yaml
import asyncio

from scripts.MultiStream import MultiStream
from scripts.collectResults import find_files_and_create_object

# TODO: Handle Variable output
import subprocess
import os


async def run_robot_task(
    variables=object(),
    workingdir="workers/default",
    outputdir="output",
    script="",
    secrets_manager=None,
):
    workingdir = os.path.normpath(workingdir)
    outputdir = os.path.normpath(outputdir)

    def callback():
        os.makedirs(workingdir, exist_ok=True)

        if secrets_manager and not variables.get("SECRETS"):
            variables["SECRETS"] = secrets_manager.get_secrets()

        # Save the variables to a file
        yaml.dump(
            variables,
            open(os.path.join(workingdir, "variables.yaml"), "w", encoding="UTF8"),
        )

        # Save the script to a file
        with open(
            os.path.join(workingdir, "tasks.robot"), "w", encoding="UTF8"
        ) as output_file:
            output_file.write(script)

        os.environ["ROBOT_ARTIFACTS"] = os.path.join(workingdir, "robot_artifacts")

        with open(
            os.path.join(workingdir, "output.txt"), "w", encoding="UTF8"
        ) as output_file:
            outputBuffer = io.StringIO()
            streams = [output_file, outputBuffer, sys.stdout]
            outStream = MultiStream(*streams)

            # Ensure Camunda Library is discoverable
            # Thid is very flaky and should be replaced with a more robust solution
            env = os.environ.copy()
            env["PYTHONPATH"] = (
                os.path.abspath(os.getcwd()) + os.pathsep + env.get("PYTHONPATH", "")
            )

            process = subprocess.Popen(
                [
                    "robot",
                    "--rpa",
                    "--outputdir",
                    outputdir,
                    "--variablefile",
                    "./variables.yaml",
                    "--report",
                    "none",
                    "--logtitle",
                    "Task log",
                    "./tasks.robot",
                ],
                cwd=os.path.abspath(workingdir),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
            )

            for line in iter(process.stdout.readline, b""):
                outStream.write(line.decode())

            process.communicate()

            result = process.returncode

            stdOutValue = outputBuffer.getvalue()
            outputBuffer.close()

        # Remove the SECRETS variable from the file after the run completes
        if "SECRETS" in variables:
            del variables["SECRETS"]
            yaml.dump(
                variables,
                open(os.path.join(workingdir, "variables.yaml"), "w", encoding="UTF8"),
            )

        absOutputDir = os.path.abspath(os.path.join(workingdir, outputdir))
        variablesToSet = get_output_variables(workingdir)

        return {
            "variables": variablesToSet,
            "outputPath": os.path.join(absOutputDir, "output.xml"),
            "logPath": os.path.join(absOutputDir, "log.html"),
            "exitCode": result,
            "stdOut": stdOutValue,
        }

    thread = asyncio.to_thread(callback)
    threadResult = await thread

    return threadResult


def get_output_variables(workingdir):
    # Load YAML file
    outputs_file = os.path.join(workingdir, "outputs.yml")
    if not os.path.exists(outputs_file):
        return {}

    with open(outputs_file, "r", encoding="UTF8") as stream:
        try:
            data_loaded = yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)

    # Use the loaded data
    return data_loaded
