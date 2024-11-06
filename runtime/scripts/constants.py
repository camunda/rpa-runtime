import os

RPA_SCRIPTS_FOLDER_NAME = "rpaScripts"
RPA_SCRIPTS_FOLDER = os.path.join(os.getcwd(), RPA_SCRIPTS_FOLDER_NAME)

WORKER_FOLDER_NAME = "workers"
WORKER_FOLDER = os.path.join(os.getcwd(), WORKER_FOLDER_NAME)

if not os.path.exists(RPA_SCRIPTS_FOLDER):
    os.makedirs(RPA_SCRIPTS_FOLDER)

if not os.path.exists(WORKER_FOLDER):
    os.makedirs(WORKER_FOLDER)
