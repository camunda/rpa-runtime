> [!NOTE]  
> **Experimental Features Notice:** The code in this repository is in the experimental stage and may be unstable. Use at your own risk and avoid usage in production environments.

# Camunda RPA Runtime

The Camunda RPA Runtime is designed to bridge the gap between Robotic Process Automation (RPA) bots and the Camunda workflow engine, enabling you to seamlessly integrate your task workers with Camunda.

## Getting Started

This guide will help you set up the Camunda RPA Runtime in your development environment.

### Environment Configuration

To connect your task worker to the Camunda Cloud, you must set the following environment variables with appropriate values. The required Scope for this Client is `Zeebe` and `Secrets`:

- `ZEEBE_CLIENT_ID`: Your Zeebe client ID.
- `ZEEBE_CLIENT_SECRET`: Your Zeebe client secret.
- `CAMUNDA_CLUSTER_ID`: Your Camunda Cloud cluster ID.
- `CAMUNDA_CLUSTER_REGION`: The Region of your Cluster.

### Installation

### On Windows

- Clone or download the repository
- Run `setup.ps1`. If you can not run the file, set your Execution policy to allow remote scripts with `Set-ExecutionPolicy RemoteSigned`
- Add your credentials to `.env`
- run `start.ps1`

### Running with python

To install the required dependencies for the Camunda RPA Runtime, run the following command:

#### Prerequisites

Before you begin, ensure you have the following prerequisites installed on your system:

- Python 3.10 or higher
- pip 24 or higher

```sh
pip install --no-cache-dir -r requirements.txt --no-deps
```
This will install all the necessary Python packages as specified in the requirements.txt file.

##### Windows

On windows, you might need to update pywin32:

```sh
pip install --upgrade pywin32
```

##### Browser Automation

If you want to use browser automation, install the required browsers with

```sh
rfbrowser init
```

#### Running the Worker
With all dependencies installed and environment variables set, you can now run the task worker using the command below:

```sh
python worker.py
```
This will start the RPA Runtime worker, and it will begin listening for jobs from the Camunda Cloud.

### Running from Docker

If you prefer to run the Camunda RPA Runtime using Docker, you can pull the Docker image from the GitHub Container Registry (ghcr.io). 

To run the RPA Runtime from Docker, execute the following command:

```sh
docker run -e ZEEBE_CLIENT_ID=<your-client-id> -e ZEEBE_CLIENT_SECRET=<your-client-secret> -e CAMUNDA_CLUSTER_ID=<your-cluster-id> -v /path/to/your/scripts:/usr/src/app/rpaScripts -p 36227:36227 ghcr.io/camunda/prototype-rpa-worker:main
```

If you prefer to use Docker Compose, you can create a `docker-compose.yml` file with the following content:

```yaml
version: '3'
services:
  rpa-worker:
    image: ghcr.io/camunda/prototype-rpa-worker:main
    environment:
      - ZEEBE_CLIENT_ID=<your-client-id>
      - ZEEBE_CLIENT_SECRET=<your-client-secret>
      - CAMUNDA_CLUSTER_ID=<your-cluster-id>
    volumes:
      - /path/to/your/scripts:/usr/src/app/rpaScripts
    ports:
      - 36227:36227
```

To run the RPA Runtime using Docker Compose, execute the following command:

```sh
docker-compose up
```

Make sure to replace `<your-client-id>`, `<your-client-secret>`, `<your-cluster-id>`, and `/path/to/your/scripts` with the appropriate values for your setup.

This command will start the RPA Runtime worker using the specified environment variables and mount your scripts to the `/usr/src/app/rpaScripts` directory in the container.

## License

These source files are made available under the [Camunda License Version 1.0](/LICENSE).
