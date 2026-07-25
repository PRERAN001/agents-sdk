import { Project, Deployment, Agent, TaskMetadata, SystemLog, DocSection } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "summarizer-agent-v2",
    repoUrl: "https://github.com/deploygent/summarizer-agent",
    branch: "main",
    status: "running",
    port: 8080,
    runtimeUrl: "https://summarizer-v2.deploygent.app",
    lastDeployedAt: "2026-07-25T18:45:00Z",
    createdAt: "2026-06-10T12:00:00Z",
    framework: "DeployGent Agent SDK",
    runningAgentsCount: 4,
    envVarsCount: 6,
    cpuUsage: 28,
    memoryUsage: 45,
    description: "Multilingual text, URL & document summarization agent with customizable output formats.",
  },
  {
    id: "proj-2",
    name: "code-reviewer-pro",
    repoUrl: "https://github.com/deploygent/code-reviewer",
    branch: "main",
    status: "running",
    port: 8081,
    runtimeUrl: "https://code-reviewer.deploygent.app",
    lastDeployedAt: "2026-07-25T14:20:00Z",
    createdAt: "2026-06-15T09:30:00Z",
    framework: "DeployGent Agent SDK",
    runningAgentsCount: 2,
    envVarsCount: 12,
    cpuUsage: 62,
    memoryUsage: 78,
    description: "Automated PR review agent analyzing security vulnerabilities, performance, and formatting.",
  },
  {
    id: "proj-3",
    name: "rag-knowledge-engine",
    repoUrl: "https://github.com/deploygent/rag-vector-agent",
    branch: "prod",
    status: "deploying",
    port: 8082,
    runtimeUrl: "https://rag-engine.deploygent.app",
    lastDeployedAt: "2026-07-25T22:10:00Z",
    createdAt: "2026-07-01T15:10:00Z",
    framework: "DeployGent Agent SDK",
    runningAgentsCount: 1,
    envVarsCount: 8,
    cpuUsage: 89,
    memoryUsage: 82,
    description: "Vector embedding search and synthesis agent for corporate documentation.",
  },
  {
    id: "proj-4",
    name: "sql-agent-flow",
    repoUrl: "https://github.com/deploygent/sql-query-agent",
    branch: "main",
    status: "stopped",
    port: 8083,
    runtimeUrl: "https://sql-agent.deploygent.app",
    lastDeployedAt: "2026-07-20T11:00:00Z",
    createdAt: "2026-05-22T08:00:00Z",
    framework: "DeployGent Agent SDK",
    runningAgentsCount: 0,
    envVarsCount: 4,
    cpuUsage: 0,
    memoryUsage: 0,
    description: "Natural language to optimized SQL query generator and dry-run validator.",
  },
  {
    id: "proj-5",
    name: "customer-support-bot",
    repoUrl: "https://github.com/deploygent/support-triage-agent",
    branch: "master",
    status: "running",
    port: 8084,
    runtimeUrl: "https://support-triage.deploygent.app",
    lastDeployedAt: "2026-07-24T19:30:00Z",
    createdAt: "2026-04-12T14:45:00Z",
    framework: "DeployGent Agent SDK",
    runningAgentsCount: 8,
    envVarsCount: 15,
    cpuUsage: 41,
    memoryUsage: 58,
    description: "Automated issue triage, user inquiry resolution, and escalation workflow manager.",
  },
];

export const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: "dep-101",
    projectId: "proj-1",
    projectName: "summarizer-agent-v2",
    commitHash: "8f4a2b9",
    commitMessage: "feat: add multi-select input support & streaming chunk fix",
    status: "success",
    createdAt: "2026-07-25T18:45:00Z",
    duration: "42s",
    environment: "production",
    logs: [
      "[INFO] Cloning repository https://github.com/deploygent/summarizer-agent (commit 8f4a2b9)...",
      "[INFO] Checking Agent SDK manifest requirements...",
      "[INFO] Resolving dependencies and pre-caching models...",
      "[INFO] Containerizing workspace with DeployGent runtime image v2.4...",
      "[INFO] Allocating isolated execution environment on Port 8080...",
      "[INFO] Running health checks at http://localhost:8080/health ...",
      "[SUCCESS] Deployment complete! Agent live at https://summarizer-v2.deploygent.app",
    ],
  },
  {
    id: "dep-102",
    projectId: "proj-3",
    projectName: "rag-knowledge-engine",
    commitHash: "3c9101d",
    commitMessage: "refactor: update pinecone index connection pooling",
    status: "building",
    createdAt: "2026-07-25T22:10:00Z",
    duration: "18s",
    environment: "production",
    logs: [
      "[INFO] Triggering webhook build for commit 3c9101d...",
      "[INFO] Fetching vector store credentials...",
      "[INFO] Compiling TypeScript types for Agent tasks...",
      "[INFO] Building docker container image...",
    ],
  },
  {
    id: "dep-103",
    projectId: "proj-2",
    projectName: "code-reviewer-pro",
    commitHash: "1a98e2f",
    commitMessage: "fix: prevent regex timeouts on large diff files",
    status: "success",
    createdAt: "2026-07-25T14:20:00Z",
    duration: "35s",
    environment: "production",
    logs: [
      "[INFO] Received git push event on branch main",
      "[INFO] Verifying security signatures...",
      "[INFO] Building runtime container...",
      "[SUCCESS] Health check status 200 OK. Deployment active on Port 8081.",
    ],
  },
  {
    id: "dep-104",
    projectId: "proj-4",
    projectName: "sql-agent-flow",
    commitHash: "ef77401",
    commitMessage: "chore: update schema parser for Postgres 17",
    status: "failed",
    createdAt: "2026-07-20T11:00:00Z",
    duration: "12s",
    environment: "preview",
    logs: [
      "[INFO] Starting deployment build for sql-agent-flow...",
      "[ERROR] Failed to connect to test database host postgres.internal:5432",
      "[ERROR] Build aborted due to failed pre-deployment assertion test.",
    ],
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Summarizer Core Worker #1",
    projectId: "proj-1",
    projectName: "summarizer-agent-v2",
    status: "busy",
    model: "claude-3-5-sonnet",
    activeTask: "summarize",
    totalExecutions: 14200,
    uptime: "99.98%",
    memoryAllocated: "512 MB",
  },
  {
    id: "agent-2",
    name: "Code Audit Sentinel",
    projectId: "proj-2",
    projectName: "code-reviewer-pro",
    status: "idle",
    model: "gpt-4o",
    totalExecutions: 8940,
    uptime: "99.95%",
    memoryAllocated: "1024 MB",
  },
  {
    id: "agent-3",
    name: "Vector RAG Synthesizer",
    projectId: "proj-3",
    projectName: "rag-knowledge-engine",
    status: "busy",
    model: "gemini-1.5-pro",
    activeTask: "semantic-search",
    totalExecutions: 23100,
    uptime: "100%",
    memoryAllocated: "2048 MB",
  },
  {
    id: "agent-4",
    name: "Support Triage Router",
    projectId: "proj-5",
    projectName: "customer-support-bot",
    status: "idle",
    model: "claude-3-haiku",
    totalExecutions: 45200,
    uptime: "99.99%",
    memoryAllocated: "256 MB",
  },
];

export const MOCK_TASKS_METADATA: TaskMetadata[] = [
  {
    id: "summarize",
    name: "Text Summarizer & Analyzer",
    description: "Generates concise summaries, extracts key takeaways, and formats markdown insights from source text.",
    category: "Natural Language",
    inputs: [
      {
        name: "text",
        label: "Source Text or Document",
        type: "textarea",
        description: "Paste the long text content to summarize.",
        required: true,
        placeholder: "DeployGent is an agent deployment framework designed for autonomous cloud operations...",
        defaultValue: "DeployGent is a next-generation platform for deploying autonomous AI agents to cloud infrastructure. With instant port isolation, metadata-driven UI rendering, zero-config containerization, and built-in telemetry, developers can convert any AI prompt or agent code into a production microservice in seconds.",
      },
      {
        name: "length",
        label: "Summary Depth",
        type: "select",
        description: "Choose the target detail level.",
        required: true,
        options: ["Short Bullet Points", "Executive Briefing", "Comprehensive Breakdown"],
        defaultValue: "Executive Briefing",
      },
      {
        name: "formatMarkdown",
        label: "Format Output as Markdown",
        type: "boolean",
        description: "Include headers, lists, and visual callouts in response.",
        defaultValue: true,
      },
      {
        name: "maxWords",
        label: "Maximum Word Count",
        type: "number",
        description: "Upper limit for output text length.",
        defaultValue: 150,
      },
      {
        name: "targetLanguage",
        label: "Target Language",
        type: "select",
        options: ["English", "Spanish", "French", "German", "Japanese"],
        defaultValue: "English",
      },
    ],
    output: {
      type: "markdown",
      description: "Structured markdown summary with metadata analysis.",
    },
  },
  {
    id: "code-analysis",
    name: "Code Vulnerability & Refactoring Audit",
    description: "Performs security linting, time-complexity analysis, and returns refactored JSON diagnostics.",
    category: "Developer Tools",
    inputs: [
      {
        name: "code",
        label: "Source Code Snippet",
        type: "textarea",
        description: "Paste code to inspect for performance and security issues.",
        required: true,
        placeholder: "function calculate(data) { ... }",
        defaultValue: "async function fetchUserData(userIds) {\n  let results = [];\n  for(let id of userIds) {\n    const res = await fetch(`/api/user/${id}`);\n    results.push(await res.json());\n  }\n  return results;\n}",
      },
      {
        name: "language",
        label: "Programming Language",
        type: "select",
        options: ["TypeScript", "Python", "Go", "Rust", "Java"],
        defaultValue: "TypeScript",
      },
      {
        name: "strictSecurityMode",
        label: "Strict OWASP Security Check",
        type: "boolean",
        defaultValue: true,
      },
      {
        name: "configJson",
        label: "Linter Configuration (JSON)",
        type: "json",
        description: "Custom rules override JSON.",
        defaultValue: '{\n  "maxComplexity": 10,\n  "allowAsyncMap": true\n}',
      },
    ],
    output: {
      type: "json",
      description: "Diagnostic report object containing issues list and optimized code.",
    },
  },
  {
    id: "prompt-image-gen",
    name: "Generative Asset Prompt Enhancer",
    description: "Transforms plain concepts into production-grade photorealistic image generation prompts.",
    category: "Creative AI",
    inputs: [
      {
        name: "concept",
        label: "Base Concept",
        type: "text",
        required: true,
        placeholder: "A futuristic glowing server rack in deep space",
        defaultValue: "Cyberpunk monolith server stack surrounded by translucent glass and obsidian geometry",
      },
      {
        name: "aspectRatio",
        label: "Aspect Ratio",
        type: "select",
        options: ["16:9", "1:1", "4:3", "9:16"],
        defaultValue: "16:9",
      },
      {
        name: "qualityScore",
        label: "Render Quality Level (1-10)",
        type: "number",
        defaultValue: 9,
      },
      {
        name: "tags",
        label: "Art Style Keywords",
        type: "multi-select",
        options: ["Photorealistic", "Glassmorphism", "Octane Render", "Monochrome", "8K Resolution", "Unreal Engine 5"],
        defaultValue: ["Glassmorphism", "Monochrome", "8K Resolution"],
      },
      {
        name: "referenceImage",
        label: "Reference Image Asset",
        type: "image",
        description: "Optional reference preview.",
      },
    ],
    output: {
      type: "text",
      description: "Optimized prompt output text ready for diffusion models.",
    },
  },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  {
    id: "log-1",
    timestamp: "22:35:10.104",
    level: "INFO",
    source: "orchestrator",
    message: "Cluster health check OK. 12 active workers connected across 5 node pools.",
  },
  {
    id: "log-2",
    timestamp: "22:35:12.441",
    level: "INFO",
    source: "agent-runner",
    message: "[proj-1:summarizer-agent-v2] Task execution #8491 completed in 412ms. Token count: 320 in, 180 out.",
  },
  {
    id: "log-3",
    timestamp: "22:35:15.892",
    level: "DEBUG",
    source: "port-allocator",
    message: "Port range 8080-8090 reserved. Next auto-assign candidate: 8085.",
  },
  {
    id: "log-4",
    timestamp: "22:35:18.003",
    level: "WARN",
    source: "memory-monitor",
    message: "[proj-3:rag-knowledge-engine] Memory utilization spiked to 82% during vector indexing burst.",
  },
  {
    id: "log-5",
    timestamp: "22:35:20.512",
    level: "INFO",
    source: "telemetry",
    message: "Ingested 1,420 request events from edge proxies over past 60s window.",
  },
  {
    id: "log-6",
    timestamp: "22:35:22.910",
    level: "ERROR",
    source: "deployer",
    message: "[proj-4:sql-agent-flow] Build pipeline failed: PostgreSQL driver dependency resolution timeout.",
  },
];

export const MOCK_DOC_SECTIONS: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction to DeployGent",
    slug: "introduction",
    category: "Getting Started",
    toc: [
      { id: "what-is-deploygent", title: "What is DeployGent?" },
      { id: "key-features", title: "Key Features" },
      { id: "architecture-overview", title: "Architecture Overview" },
    ],
    content: `
# Introduction to DeployGent

DeployGent is a production-grade cloud platform engineered specifically for **deploying, scaling, and managing autonomous AI agents**.

Whether you are building natural language agents, vector RAG query engines, automated PR reviewers, or multi-modal generators, DeployGent provides instant port isolation, metadata-driven UI auto-generation, zero-config containerization, and enterprise-grade telemetry out of the box.

### Key Features

- **Metadata-Driven Playgrounds**: Render dynamic interactive UIs instantly from simple JSON schema definitions.
- **Micro-Containerization**: Every agent runs in an isolated, sandboxed runtime with dedicated port mapping.
- **Real-Time Observability**: Stream raw execution logs, monitor token consumption, memory quotas, and CPU spikes.
- **One-Click Deployments**: Connect any GitHub repository and deploy on every \`git push\`.

\`\`\`bash
# Deploy your first agent in under 10 seconds
agy deploy --repo https://github.com/your-org/my-agent --port 8080
\`\`\`
`,
  },
  {
    id: "installation",
    title: "Installation & Setup",
    slug: "installation",
    category: "Getting Started",
    toc: [
      { id: "prerequisites", title: "Prerequisites" },
      { id: "cli-install", title: "Installing the CLI" },
      { id: "auth", title: "Authenticating" },
    ],
    content: `
# Installation & Setup

Get up and running with DeployGent locally or in your CI/CD pipelines using the \`agy\` command-line interface.

### Prerequisites

- Node.js 18.x or higher
- Git version 2.30+

### Installing the DeployGent CLI

Install globally using npm or pnpm:

\`\`\`bash
npm install -g @deploygent/cli
# or via pnpm
pnpm add -g @deploygent/cli
\`\`\`

Verify your installation:

\`\`\`bash
agy --version
# Output: agy/v2.4.0 (x86_64-apple-darwin)
\`\`\`

### Authenticating your workspace

\`\`\`bash
agy login --key dgent_live_9a8f7c6e5d4c3b2a
\`\`\`
`,
  },
  {
    id: "agent-metadata",
    title: "Agent Metadata & Schemas",
    slug: "agent-metadata",
    category: "Core Concepts",
    toc: [
      { id: "schema-structure", title: "Schema Structure" },
      { id: "input-types", title: "Supported Input Types" },
      { id: "output-renderers", title: "Output Renderers" },
    ],
    content: `
# Agent Metadata & Schemas

DeployGent automatically renders your agent's interactive web UI by reading a lightweight \`deploygent.json\` metadata file placed at the root of your project.

### Schema Example

\`\`\`json
{
  "tasks": [
    {
      "id": "summarize",
      "name": "Summarize Text",
      "description": "Summarize long documents into concise takeaways",
      "inputs": [
        { "name": "text", "type": "textarea", "required": true },
        { "name": "length", "type": "number", "defaultValue": 100 },
        { "name": "format", "type": "select", "options": ["bullet", "paragraph"] }
      ],
      "output": {
        "type": "markdown"
      }
    }
  ]
}
\`\`\`

### Supported Input Types

- \`text\`, \`textarea\`, \`number\`, \`boolean\`
- \`select\`, \`multi-select\`, \`json\`
- \`file\`, \`image\`, \`audio\`, \`video\`
- \`date\`, \`time\`, \`datetime\`, \`password\`, \`email\`, \`url\`
`,
  },
];

export const MOCK_RESOURCE_USAGE = [
  { time: "00:00", cpu: 22, memory: 40, requests: 340 },
  { time: "04:00", cpu: 18, memory: 38, requests: 210 },
  { time: "08:00", cpu: 45, memory: 58, requests: 890 },
  { time: "12:00", cpu: 74, memory: 72, requests: 1650 },
  { time: "16:00", cpu: 62, memory: 65, requests: 1420 },
  { time: "20:00", cpu: 35, memory: 48, requests: 780 },
  { time: "24:00", cpu: 28, memory: 45, requests: 510 },
];
