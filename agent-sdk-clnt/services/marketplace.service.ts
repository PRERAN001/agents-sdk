import { connectDB } from "@/lib/mongodb";
import MarketplaceAgent, { IMarketplaceAgent } from "@/models/marketplaceAgent";

export class MarketplaceService {
  /**
   * Seed curated production agent templates if empty.
   */
  static async seedMarketplaceIfEmpty(): Promise<void> {
    await connectDB();
    const count = await MarketplaceAgent.countDocuments();
    if (count > 0) return;

    const templates = [
      {
        slug: "agent-devops-core",
        name: "DevOps & Infrastructure Automation Agent",
        description: "Autonomous agent for CI/CD pipeline diagnosis, Docker container management, and Kubernetes deployment orchestration.",
        category: "DevOps",
        tags: ["Docker", "Kubernetes", "CI/CD", "Python"],
        stars: 124,
        clones: 389,
        author: "DeployGent Team",
        version: "2.5.0",
        systemPrompt: "You are a senior DevOps Infrastructure Agent. You monitor cluster health, automate container builds, and diagnose pipeline failures.",
        requiredTools: ["docker_exec", "kubectl_apply", "git_commit_inspector"],
        cliCommand: "npx deploygent clone agent-devops-core",
      },
      {
        slug: "agent-support-ai",
        name: "Customer Support Multi-Modal Assistant",
        description: "Multi-channel agent capable of processing text, audio, and visual support tickets with instant knowledge base RAG retrieval.",
        category: "Support",
        tags: ["Multi-Modal", "RAG", "Customer Support"],
        stars: 98,
        clones: 240,
        author: "AI Engineering Group",
        version: "1.9.4",
        systemPrompt: "You are an empathetic, precise Customer Support Agent. You resolve ticket issues, query user databases, and escalate complex bugs.",
        requiredTools: ["zendesk_api", "vector_search", "audio_transcribe"],
        cliCommand: "npx deploygent clone agent-support-ai",
      },
      {
        slug: "agent-code-auditor",
        name: "Code Review & Security Vulnerability Auditor",
        description: "Static code analysis agent that scans pull requests for OWASP Top 10 vulnerabilities, memory leaks, and performance bottlenecks.",
        category: "Security",
        tags: ["Security", "Code Review", "Static Analysis"],
        stars: 182,
        clones: 512,
        author: "SecOps Research",
        version: "3.1.0",
        systemPrompt: "You are a Security Auditor Agent. You inspect source code diffs for SQL injection, XSS, and hardcoded secrets.",
        requiredTools: ["ast_parser", "semgrep_scanner", "github_pull_request"],
        cliCommand: "npx deploygent clone agent-code-auditor",
      },
      {
        slug: "agent-fin-rag",
        name: "Financial Data & Market Analyst Agent",
        description: "Real-time market sentiment analyzer and financial statement RAG tool for portfolio managers.",
        category: "Finance",
        tags: ["Finance", "Market Data", "RAG"],
        stars: 110,
        clones: 195,
        author: "Quant Lab",
        version: "2.0.1",
        systemPrompt: "You are a Quantitative Analyst Agent. You calculate earnings multiples, parse 10-K filings, and evaluate stock sentiment.",
        requiredTools: ["sec_filings_rag", "stock_price_feed", "chart_generator"],
        cliCommand: "npx deploygent clone agent-fin-rag",
      },
      {
        slug: "agent-web-researcher",
        name: "Web Research & Autonomous Scraper Agent",
        description: "Crawls documentation websites, synthesizes technical research reports, and outputs structured JSON data.",
        category: "Research",
        tags: ["Web Crawling", "Research", "JSON"],
        stars: 86,
        clones: 174,
        author: "Data Platform",
        version: "1.4.0",
        systemPrompt: "You are an Autonomous Research Agent. You crawl technical documentation, synthesize findings, and export Markdown reports.",
        requiredTools: ["puppeteer_browser", "readability_parser", "summarizer"],
        cliCommand: "npx deploygent clone agent-web-researcher",
      },
    ];

    await MarketplaceAgent.insertMany(templates);
  }

  /**
   * Fetches marketplace agent templates with optional category filter and search query.
   */
  static async getMarketplaceAgents(options: { category?: string; search?: string }) {
    await connectDB();
    await this.seedMarketplaceIfEmpty();

    const filter: any = {};
    if (options.category && options.category !== "all") {
      filter.category = options.category;
    }

    if (options.search?.trim()) {
      const searchRegex = new RegExp(options.search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { slug: searchRegex },
      ];
    }

    return MarketplaceAgent.find(filter).sort({ stars: -1 });
  }

  /**
   * Generate local agent template files for zip export.
   */
  static getAgentTemplateFiles(slug: string) {
    const pyproject = `[project]
name = "${slug}"
version = "2.5.0"
description = "DeployGent Autonomous Agent Template"
dependencies = [
    "deploygent-sdk>=2.5.0",
    "pydantic>=2.0.0",
    "requests>=2.31.0"
]
`;

    const agentPy = `from deploygent import Agent, Task, TextInput, TextAreaInput

agent = Agent(name="${slug.replace(/-/g, "_")}", version="2.5.0")

@agent.task
def execute_agent_task(prompt: TextAreaInput(label="User Instruction")) -> str:
    """Executes production AI agent workflow."""
    return agent.run_pipeline(prompt)

if __name__ == "__main__":
    agent.serve(port=8000)
`;

    const envExample = `DEPLOYGENT_API_KEY=your_api_key_here
OPENAI_API_KEY=your_openai_key_here
PORT=8000
`;

    const readme = `# ${slug}

This is a ready-to-run DeployGent AI Agent template.

## Quick Start on Local Machine

1. Install dependencies:
\`\`\`bash
pip install -e .
\`\`\`

2. Run local agent runtime:
\`\`\`bash
python agent.py
\`\`\`

3. Deploy to DeployGent:
\`\`\`bash
npx deploygent deploy
\`\`\`
`;

    return {
      "agent.py": agentPy,
      "pyproject.toml": pyproject,
      ".env.example": envExample,
      "README.md": readme,
    };
  }
}
