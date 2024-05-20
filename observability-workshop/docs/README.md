# Services Skeleton

## Requirements

* pnpm
* NodeJS 20
* Docker
* Docker Compose

## Instalation

```bash
 gh repo clone parraletz/observability-workshop-uaq 
```

## Motivation

This service was created with the aim of serving as a foundation for all services developed within the technology platform. It acts as a skeleton or template that establishes a standard structure and best practices in coding, configuration, and deployment.

By using this service as a starting point, developers can ensure their software is consistent with the platform's ecosystem, maintains code quality, and facilitates integration and maintenance. Moreover, it promotes an environment where common knowledge and tools can be shared, which accelerates development and reinforces collaboration.

With this skeleton, we aspire to provide a solid base that includes:

- A clear and well-organized project structure.
- TypeScript configuration for strong typing and reduced error proneness.
- Integration of Express to handle HTTP requests and responses effortlessly.
- Design patterns and software architecture that favor scalability and modularity.
- Implementation of observability and monitoring practices from the start, using OpenTelemetry.

This approach allows us to focus on adding value and specific functionalities while relying on a robust and tested foundation.


## Docker Compose

We have included a `docker-compose.yml` file to simplify the development and deployment process. This file configures the necessary services, including the application server, observability tools, and a load testing tool, ensuring a comprehensive development environment.

### Docker Compose Setup

The project includes a `docker-compose.yml` file to facilitate an easy and consistent development and deployment environment. Here's a brief overview of the configured services:

- `tars`: The main application service built from the current directory. It exposes port 3000 and includes environment variables for observability configuration.
- `o11y`: An observability service using Grafana's OTel collector, exposed on several ports for access to traces and metrics.
- `locust`: A load testing service configured with Locust, accessible via port 8089.

To start the services, simply run:

```bash
make build
```

```bash
make run
```
This will build and start all the necessary components defined in the `docker-compose.yml`, allowing you to focus on developing and testing your application in a containerized environment.


## Configuring Locust for Load Testing

Locust is an easy-to-use, distributed, user load testing tool designed to load test your application by simulating users. It allows you to define user behavior with Python code, and swarm your system with millions of simultaneous users.

### Locust configuration file


Your project includes Locust configurations within the `docker-compose.yml` under the `locust` service. The actual Locust test script and configuration are expected to be in the `./tools/locust` directory.

Here's how to set up your Locust test scripts:

1. **Create Locust Test Scripts**: Inside the `./tools/locust` directory, create a file named `locustfile.py`. This file will contain your test scenarios.


```python

# tools/locustfile

from locust import task
from locust import between
from locust import HttpUser


class TarsTaskSet(HttpUser):
    
    wait_time = between(1, 5)

    @task
    def get_item(self):
        self.get_item_by_id()

    @task
    def push_item(self):
        self.push_items()
...
```

This script defines a user class that simulates a user interacting with your application's homepage and items API endpoint.

2 Configuration File: Optionally, you can create a locust.conf file in the same directory to set default options for your Locust tests.

Example locust.conf:

```bash
# tools/locust.conf
locustfile = /mnt/locust/locustfile.py
host = http://tars:3000
users = 10
spawn-rate = 10
run-time = 5m
headless = true
autostart = true
```

This configuration runs Locust in headless mode, simulating 10 users at a spawn rate of 10 users per second, targeting http://tars:3000 for up to 5 minutes.

For more configuration options visit [Locust Configfuration Options](https://docs.locust.io/en/stable/configuration.html#configuration-file).

### Running Locust Tests

With Docker Compose, starting Locust along with your application and observability stack is straightforward. Run the following command in your project's root directory:

```bash
docker-compose build

```

## Observability with grafana/otel-lgtm

The `grafana/otel-lgtm` container within our `docker-compose.yml` serves as an all-in-one observability stack that includes the following components:

- **OpenTelemetry Collector**: Receives telemetry data and is capable of receiving data via OTLP on ports 4317 (gRPC) or 4318 (HTTP/1.1).
- **Prometheus Metric Database**: Stores and allows querying of time series data.
- **Tempo Trace Database**: Responsible for storing and retrieving distributed tracing data.
- **Loki Logs Database**: Manages log aggregation with efficient storage, querying, and exploration.

These components are integrated into the container and are designed to work together seamlessly, providing a powerful observability platform. Grafana, which runs on port 3001, serves as the user interface, allowing you to visualize metrics, logs, and traces.

### Accessing Grafana

To access the Grafana dashboard:

1. Navigate to `http://localhost:3001` in your web browser.
2. Use the default login (admin/admin) unless you've configured it otherwise.

Once logged in, you can configure your data sources in Grafana to point to Prometheus, Tempo, and Loki within the `grafana/otel-lgtm` container. This setup allows you to create comprehensive dashboards that give insights into your application's performance and health.

For more detailed configuration and usage, please refer to the official Grafana, Loki, Prometheus, and Tempo documentation.
