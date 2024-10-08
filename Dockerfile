# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install xvfb and other dependencies you might need
RUN apt-get update && apt-get install -y \
    xvfb \
    nodejs \
    npm \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libatspi2.0-0 \
    libxdamage1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt --no-deps
RUN rfbrowser init

# Make port 36227 available to the world outside this container
EXPOSE 36227

# Define environment variable
# Worker configuration
ENV ENABLE_WORKER=true
ENV ZEEBE_CLIENT_ID=ID
ENV ZEEBE_CLIENT_SECRET=SECRET
ENV CAMUNDA_CLUSTER_ID=CLUSTER_ID
ENV PYTHONUNBUFFERED=1

# Local development configuration
ENV ENABLE_REST=true
ENV PORT=36227
# Bind http server to 0.0.0.0 so it accepts connections from outside the container
ENV HOST=0.0.0.0

# Setup XVFB-Server to run headless
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Run worker.py when the container launches
CMD ["python", "./worker.py"]
