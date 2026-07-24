import click
import json
from .loader import load_agent
@click.group()
def cli():
    """Prava CLI"""
    pass


@cli.command()
@click.option("--host", default="0.0.0.0", help="Host address")
@click.option("--port", default=8000, type=int, help="Port number")
def serve(host, port):
    agent = load_agent()
    agent.serve(host=host, port=port)


@cli.command()
def describe():

    agent = load_agent()

    print(
        json.dumps(
            agent.describe(),
            indent=4
        )
    )


@cli.command()
@click.argument("task")
@click.option(
    "--inputs",
    default="{}",
    help='JSON string of inputs. Example: \'{"topic":"AI"}\''
)
def run(task, inputs):

    agent = load_agent()

    try:
        parsed_inputs = json.loads(inputs)

    except Exception:
        raise click.ClickException("Invalid JSON passed to --inputs")

    result = agent.run(
        task_name=task,
        inputs=parsed_inputs
    )

    if isinstance(result, (dict, list)):
        print(json.dumps(result, indent=4))
    else:
        print(result)


@cli.command()
def doctor():

    try:
        agent = load_agent()

        click.echo("✓ Agent Loaded")
        click.echo(f"✓ Name: {agent.name}")
        click.echo(f"✓ Version: {agent.version}")
        click.echo(f"✓ Tasks: {len(agent.tasks)}")

        if len(agent.tasks) == 0:
            click.echo("⚠ No tasks registered")

        click.echo("✓ Metadata Generated")

    except Exception as e:
        raise click.ClickException(str(e))


if __name__ == "__main__":
    cli()