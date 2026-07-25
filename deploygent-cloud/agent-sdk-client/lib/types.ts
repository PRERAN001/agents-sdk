export type ProjectStatus = "running" | "deploying" | "stopped" | "failed" | "building";

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  branch: string;
  status: ProjectStatus;
  port: number;
  runtimeUrl: string;
  lastDeployedAt: string;
  createdAt: string;
  framework: string;
  runningAgentsCount: number;
  envVarsCount: number;
  cpuUsage: number;
  memoryUsage: number;
  description: string;
}

export type DeploymentStatus = "queued" | "building" | "containerizing" | "deploying" | "success" | "failed";

export interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  commitHash: string;
  commitMessage: string;
  status: DeploymentStatus;
  createdAt: string;
  duration: string;
  environment: "production" | "preview" | "staging";
  logs: string[];
}

export interface Agent {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: "idle" | "busy" | "error";
  model: string;
  activeTask?: string;
  totalExecutions: number;
  uptime: string;
  memoryAllocated: string;
}

export type InputType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "password"
  | "email"
  | "url"
  | "date"
  | "time"
  | "datetime"
  | "file"
  | "image"
  | "audio"
  | "video"
  | "select"
  | "multi-select"
  | "json";

export interface TaskInputSchema {
  name: string;
  label?: string;
  type: InputType;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[];
  placeholder?: string;
}

export type OutputType = "markdown" | "json" | "image" | "text" | "logs";

export interface TaskOutputSchema {
  type: OutputType;
  description?: string;
}

export interface TaskMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: TaskInputSchema[];
  output: TaskOutputSchema;
}

export interface ExecutionRecord {
  id: string;
  taskId: string;
  taskName: string;
  status: "running" | "success" | "failed";
  inputs: Record<string, any>;
  output: any;
  durationMs: number;
  tokensUsed: number;
  timestamp: string;
}

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface DocSection {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  toc?: { id: string; title: string }[];
}
