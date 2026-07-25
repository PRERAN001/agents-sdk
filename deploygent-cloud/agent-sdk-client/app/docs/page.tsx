"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Rocket,
  Package,
  Play,
  Code2,
  Server,
  Boxes,
  ChevronRight,
  Copy,
  Check,
  Terminal,
} from "lucide-react";

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white antialiased">
      {/* Background Subtle Grid Texture */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-950 text-white">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950">
              DeployGent
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
            >
              Dashboard
            </Link>

            <Link
              href="/projects/new"
              className="rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              Deploy Agent
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Hero */}
        <div className="border-b border-zinc-200 pb-16">
          <span className="inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
            Documentation
          </span>

          <h1 className="mt-6 text-5xl font-black tracking-tighter text-zinc-950 sm:text-7xl lg:text-8xl leading-[0.95] uppercase">
            Build. <br />
            Deploy. <br />
            Execute.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600">
            DeployGent automatically parses Python AI agent modules, extracts task
            metadata, generates web execution forms, and handles runtime infrastructure.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects/new"
              className="group flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              Get Started
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-zinc-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-zinc-50"
            >
              Homepage
            </Link>
          </div>
        </div>

        {/* Anchor Quick Navigation */}
        <div className="py-12 border-b border-zinc-200">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-6">
            Quick Index
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Getting Started",
              "Installation",
              "Quick Start",
              "Agent",
              "Tasks",
              "Inputs",
              "Outputs",
              "Runtime",
              "Deployment",
              "CLI",
              "API",
              "Examples",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="rounded border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs font-mono font-medium text-zinc-700 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950"
              >
                # {item}
              </a>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-20 py-16 max-w-4xl">
          {/* Introduction */}
          <section id="getting-started" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <BookOpen size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                Getting Started
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 font-normal">
              DeployGent turns standard Python repositories into production-ready agent endpoints. The platform clones your code repository, installs dependencies via standard requirements files, inspects module decorators via AST analysis, and hosts an interactive web playground automatically.
            </p>
          </section>

          {/* Installation */}
          <section id="installation" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Package size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                Installation
              </h2>
            </div>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-4 text-white shadow-md">
              <button
                onClick={() => copyToClipboard("pip install deploygent", "install")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
              >
                {copiedId === "install" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200">
                pip install deploygent
              </pre>
            </div>
          </section>

          {/* Quick Start */}
          <section id="quick-start" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Rocket size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                Quick Start
              </h2>
            </div>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-4 text-white shadow-md">
              <button
                onClick={() =>
                  copyToClipboard(
                    `from deploygent import Agent\n\nagent = Agent(\n    name="Summarizer",\n    description="Summarize long documents."\n)\n\nagent.serve()`,
                    "quickstart"
                  )
                }
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
              >
                {copiedId === "quickstart" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto">
{`from deploygent import Agent

agent = Agent(
    name="Summarizer",
    description="Summarize long documents."
)

agent.serve()`}
              </pre>
            </div>
          </section>

          {/* Agent */}
          <section id="agent" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Boxes size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                Agent Specification
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 font-normal">
              Every DeployGent repository exposes an initialized Agent instance. The Agent class aggregates operational metadata, registered tasks, runtime parameters, and standard IO bindings required to auto-render input interfaces.
            </p>
          </section>

          {/* Tasks */}
          <section id="tasks" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Play size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                Task Registration
              </h2>
            </div>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-4 text-white shadow-md">
              <button
                onClick={() => copyToClipboard(`@agent.task\ndef summarize(text: str) -> str:\n    return text`, "tasks")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
              >
                {copiedId === "tasks" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto">
{`@agent.task
def summarize(text: str) -> str:
    return text`}
              </pre>
            </div>
          </section>

          {/* Inputs */}
          <section id="inputs" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight uppercase text-zinc-950 mb-4">
              Input Components
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "TextInput",
                "NumberInput",
                "BooleanInput",
                "SelectInput",
                "FileInput",
                "ImageInput",
                "AudioInput",
                "VideoInput",
                "JSONInput",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs font-semibold text-zinc-950"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Outputs */}
          <section id="outputs" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight uppercase text-zinc-950 mb-4">
              Output Renderers
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "TextOutput",
                "MarkdownOutput",
                "JSONOutput",
                "ImageOutput",
                "FileOutput",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs font-semibold text-zinc-950"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Runtime */}
          <section id="runtime" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Server size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                Runtime Management
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 font-normal">
              DeployGent allocates dedicated execution ports, spawns isolated worker sub-processes, monitors execution state, and generates strict OpenAPI REST specifications for every agent deployed.
            </p>
          </section>

          {/* Deployment */}
          <section id="deployment" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight uppercase text-zinc-950 mb-4">
              Deploying via CLI
            </h2>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-4 text-white shadow-md">
              <button
                onClick={() => copyToClipboard("deploygent deploy", "deploy")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
              >
                {copiedId === "deploy" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200">
                deploygent deploy
              </pre>
            </div>
          </section>

          {/* CLI Commands */}
          <section id="cli" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Terminal size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                CLI Commands
              </h2>
            </div>
            <div className="space-y-2">
              {[
                "deploygent deploy",
                "deploygent serve",
                "deploygent doctor",
                "deploygent describe",
              ].map((cmd) => (
                <div
                  key={cmd}
                  className="rounded border border-zinc-200 bg-zinc-50/50 p-3 font-mono text-xs text-zinc-950 font-semibold"
                >
                  $ {cmd}
                </div>
              ))}
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-4">
              <Code2 size={22} />
              <h2 className="text-2xl font-bold tracking-tight uppercase">
                REST API Reference
              </h2>
            </div>
            <div className="space-y-2">
              {[
                { method: "POST", path: "/run", desc: "Execute a task" },
                { method: "GET", path: "/health", desc: "Instance health status" },
                { method: "GET", path: "/metadata", desc: "Extract agent metadata" },
                { method: "GET", path: "/tasks", desc: "List registered tasks" },
              ].map((route) => (
                <div
                  key={route.path}
                  className="flex items-center justify-between rounded border border-zinc-200 bg-white p-3 font-mono text-xs"
                >
                  <span className="font-bold text-zinc-950">
                    <span className="text-zinc-500 mr-2">{route.method}</span>
                    {route.path}
                  </span>
                  <span className="text-zinc-500">{route.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section id="examples" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight uppercase text-zinc-950 mb-6">
              Agent Templates
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Summarizer",
                "OCR",
                "Translator",
                "Chatbot",
                "Image Generator",
                "Sentiment Analysis",
              ].map((example) => (
                <div
                  key={example}
                  className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-950"
                >
                  <h3 className="font-bold text-zinc-950 text-base">{example}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Standard DeployGent agent implementation template.
                  </p>
                  <button className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-950 group-hover:underline">
                    View Template
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <footer className="mt-20 border-t border-zinc-200 pt-12 pb-20">
          <div className="rounded-2xl border border-zinc-950 bg-zinc-950 p-10 text-white">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase">
              Ready to deploy your first AI Agent?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Build your agent. Push it to GitHub. Deploy it with DeployGent.
            </p>
            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-zinc-200"
            >
              Deploy Now
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}