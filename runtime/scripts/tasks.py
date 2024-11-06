import os
import fnmatch
from pyzeebe import ZeebeTaskRouter, Job

from scripts.constants import RPA_SCRIPTS_FOLDER
from scripts.rpa import run_robot_task


async def my_exception_handler(exception: Exception, job: Job) -> None:
    print(exception)
    await job.set_failure_status(message=str(exception))


def add_task_to_router(router, secrets_manager, task_name, task_function):
    print("creating task " + "camunda::RPA-Task::" + task_name)

    timeout_seconds = int(os.environ.get("TIMEOUT_SECONDS", 60))
    parallel_executions = int(os.environ.get("MAX_PARALLEL_EXECUTIONS", 1))

    @router.task(
        task_type="camunda::RPA-Task::" + task_name,
        exception_handler=my_exception_handler,
        timeout_ms=timeout_seconds * 1000,
        max_running_jobs=parallel_executions,
        max_jobs_to_activate=parallel_executions,
    )
    async def rpa_task(job: Job):
        variables = job.variables.get("camundaRpaTaskInput") or job.variables

        result = await run_robot_task(
            variables=variables,
            workingdir=f"workers/{task_name}/{job.key}",
            outputdir="./output",
            script=task_function,
            secrets_manager=secrets_manager,
        )
        if result.get("exitCode") != 0:
            raise Exception(
                result.get(
                    "stdOut", f"Process failed with exit code {result.get('exitCode')}"
                )
            )

        return result.get("variables")

    return rpa_task


def create_router(secrets_manager):
    router = ZeebeTaskRouter()

    # Loop over all files in the directory
    for root, dirs, files in os.walk(RPA_SCRIPTS_FOLDER):
        for filename in fnmatch.filter(files, "*.robot"):
            # Construct the full file path
            file_path = os.path.join(root, filename)
            # Read the content of the .robot file
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
            # Remove the .robot suffix from the filename
            filename_without_suffix = os.path.splitext(filename)[0]
            # Call the function with the filename (without suffix) and the file content
            add_task_to_router(
                router, secrets_manager, filename_without_suffix, content
            )

    return router
