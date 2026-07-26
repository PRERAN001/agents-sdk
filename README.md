
# DeployGent
<img width="2146" height="733" alt="ChatGPT Image Jul 26, 2026, 09_13_00 AM" src="https://github.com/user-attachments/assets/5d1f504c-d43d-42b5-8b0b-d98f8f6fae38" />
DeployGent is an open-source framework for building, deploying, and running AI agents without writing backend APIs, dashboards, or deployment infrastructure.

Define your agent using simple Python code, describe its inputs and outputs, and DeployGent automatically generates an interactive UI, exposes REST endpoints, and deploys your agent to the cloud.

## Features

- Zero backend development
- Automatic UI generation
- Deploy with a single command
- Built-in REST API
- Interactive web dashboard
- Cloud deployment
- Agent versioning
- Input validation
- Multiple input and output types
- Real-time execution
- Secure environment variable management
- Scalable runtime architecture

## Installation

```bash
pip install deploygent
```

## Quick Start

Create a new agent.

```python
from deploygent import Agent
from deploygent.input import TextInput
from deploygent.output import TextOutput

agent = Agent(
    name="Greeting Agent",
    description="Simple greeting example."
)

@agent.task
def greet(
    name: TextInput(label="Your Name")
) -> TextOutput:
    return f"Hello, {name}!"

agent.serve()
```

Run the agent.

```bash
python agent.py
```

## Deploy to DeployGent Cloud

Authenticate.

```bash
deploygent login
```

Deploy your agent.

```bash
deploygent deploy
```

Your agent will automatically receive:

- Hosted runtime
- Interactive dashboard
- Public API endpoint
- Generated web interface
- Execution monitoring

## Input Types

DeployGent currently supports:

- TextInput
- NumberInput
- BooleanInput
- SelectInput
- FileInput

## Output Types

Supported outputs include:

- TextOutput
- MarkdownOutput
- JSONOutput
- ImageOutput

## Example

```python
from deploygent import Agent
from deploygent.input import TextInput, NumberInput
from deploygent.output import TextOutput

agent = Agent(
    name="Age Predictor"
)

@agent.task
def predict(
    name: TextInput(),
    age: NumberInput()
) -> TextOutput:
    return f"{name} is {age} years old."

agent.serve()
```

## CLI

Run the development server.

```bash
deploygent serve
```

Deploy an agent.

```bash
deploygent deploy
```

Generate metadata.

```bash
deploygent describe
```

Verify your installation.

```bash
deploygent doctor
```

## How It Works

1. Build your agent in Python.
2. Define inputs and outputs.
3. Run locally or deploy to the cloud.
4. DeployGent generates the interface and API.
5. Users interact with your agent through the generated application.

## Roadmap

- Streaming responses
- Authentication
- Team workspaces
- Scheduled tasks
- Agent marketplace
- Webhooks
- Custom domains
- Observability
- Secrets manager
- SDKs for additional languages

