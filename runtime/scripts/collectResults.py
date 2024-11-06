import os
import base64
import mimetypes
from glob import glob


def file_to_data_url(file_path):
    """
    Convert an image file to a data URL.
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    with open(file_path, "rb", encoding="UTF8") as f:
        encoded_string = base64.b64encode(f.read()).decode("utf-8")
        data_url = f"data:{mime_type};base64,{encoded_string}"
    return data_url


def find_files_and_create_object(start_path=os.getcwd()):
    """
    Finds all files within a folder called 'robot_artifacts' and creates an object with
    the structure fileName: content. Sets the content as a data URL for images.
    """
    artifacts = {}
    pattern = os.path.join(start_path, "**/robot_artifacts/**/*")

    for file_path in glob(pattern, recursive=True):
        if os.path.isfile(file_path):
            file_name = os.path.basename(file_path)
            file_name = file_name.replace(".", "_")
            mime_type, _ = mimetypes.guess_type(file_path)
            if mime_type and mime_type.startswith("image/"):
                content = file_to_data_url(file_path)
            else:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            artifacts[file_name] = content
    return artifacts
