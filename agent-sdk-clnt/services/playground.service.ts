export type InputType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "password"
  | "file"
  | "image"
  | "audio"
  | "video"
  | "json"
  | "select"
  | "multiselect";

export type OutputType =
  | "text"
  | "markdown"
  | "json"
  | "image"
  | "audio"
  | "video"
  | "file";

export interface InputMetadata {
  name: string;
  type: InputType;
  label: string;
  description?: string;
  required?: boolean;
  default?: any;
  options?: string[];
  placeholder?: string;
  accept?: string;
}

export interface OutputMetadata {
  type: OutputType | string;
  description?: string;
}

export interface TaskMetadata {
  name: string;
  displayName?: string;
  category?: string;
  description?: string;
  inputs: InputMetadata[];
  outputs: OutputMetadata;
}

export interface AgentMetadata {
  name: string;
  version: string;
  description?: string;
  tasks: TaskMetadata[];
  envs?: Array<{
    name: string;
    required: boolean;
    description?: string;
  }>;
}

export class PlaygroundService {
  /**
   * Clean minimal agent metadata structure produced by deploygent.Agent.describe()
   */
  static getSdkMetadata(): AgentMetadata {
    return {
      name: "DeployGent Agent",
      version: "1.0.0",
      description: "Autonomous Python agent powered by DeployGent SDK.",
      envs: [
        { name: "OPENAI_API_KEY", required: true, description: "API Secret Key for LLM execution" },
      ],
      tasks: [
        {
          name: "generate_summary",
          displayName: "Generate Summary",
          category: "General",
          description: "Executes agent workflow with input prompt.",
          inputs: [
            {
              name: "prompt",
              type: "textarea",
              label: "Prompt / Document Input",
              description: "Input text or instructions for the agent.",
              required: true,
              placeholder: "Enter prompt...",
            },
          ],
          outputs: {
            type: "string",
          },
        },
      ],
    };
  }
}
