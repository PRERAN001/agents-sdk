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
  FileText,
  AlignLeft,
  Hash,
  ToggleLeft,
  Lock,
  Mail,
  Link2,
  Calendar,
  Clock,
  CalendarClock,
  Upload,
  ImageIcon,
  Music,
  Video,
  List,
  ListChecks,
  Braces,
  FileType,
  FileSpreadsheet,
  FileArchive,
  File as FileIcon,
  Table as TableIcon,
} from "lucide-react";

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const inputComponents = [
    {
      name: "TextInput",
      icon: FileText,
      desc: "Single-line free text entry.",
      props: "label · placeholder · required · default",
    },
    {
      name: "TextAreaInput",
      icon: AlignLeft,
      desc: "Multi-line free text entry.",
      props: "rows (default 5)",
    },
    {
      name: "NumberInput",
      icon: Hash,
      desc: "Numeric entry with bounds.",
      props: "min · max · step (default 1)",
    },
    {
      name: "BooleanInput",
      icon: ToggleLeft,
      desc: "On/off toggle switch.",
      props: "default (true / false)",
    },
    {
      name: "PasswordInput",
      icon: Lock,
      desc: "Masked single-line text entry.",
      props: "label · placeholder · required",
    },
    {
      name: "EmailInput",
      icon: Mail,
      desc: "Text entry validated as an email address.",
      props: "label · placeholder · required",
    },
    {
      name: "URLInput",
      icon: Link2,
      desc: "Text entry validated as a URL.",
      props: "label · placeholder · required",
    },
    {
      name: "DateInput",
      icon: Calendar,
      desc: "Calendar date picker.",
      props: "min · max",
    },
    {
      name: "TimeInput",
      icon: Clock,
      desc: "Time-of-day picker.",
      props: "label · required · default",
    },
    {
      name: "DateTimeInput",
      icon: CalendarClock,
      desc: "Combined date & time picker.",
      props: "label · required · default",
    },
    {
      name: "FileInput",
      icon: Upload,
      desc: "Generic file upload.",
      props: "accept · multiple · max_size",
    },
    {
      name: "ImageInput",
      icon: ImageIcon,
      desc: "File upload restricted to image/*.",
      props: "extends FileInput",
    },
    {
      name: "AudioInput",
      icon: Music,
      desc: "File upload restricted to audio/*.",
      props: "extends FileInput",
    },
    {
      name: "VideoInput",
      icon: Video,
      desc: "File upload restricted to video/*.",
      props: "extends FileInput",
    },
    {
      name: "SelectInput",
      icon: List,
      desc: "Single-choice dropdown.",
      props: "options[] · searchable",
    },
    {
      name: "MultiSelectInput",
      icon: ListChecks,
      desc: "Multi-choice selector.",
      props: "options[] · searchable",
    },
    {
      name: "JSONInput",
      icon: Braces,
      desc: "Structured JSON entry with live validation.",
      props: "schema (optional)",
    },
  ];

  const outputComponents = [
    {
      name: "TextOutput",
      icon: FileText,
      desc: "Renders a plain text response.",
      props: "title · description",
    },
    {
      name: "MarkdownOutput",
      icon: AlignLeft,
      desc: "Renders formatted markdown content.",
      props: "title · description",
    },
    {
      name: "JSONOutput",
      icon: Braces,
      desc: "Renders a structured JSON payload.",
      props: "pretty · collapsible",
    },
    {
      name: "HTMLOutput",
      icon: Code2,
      desc: "Renders raw HTML markup.",
      props: "title · description",
    },
    {
      name: "TableOutput",
      icon: TableIcon,
      desc: "Renders tabular data as a data grid.",
      props: "sortable · searchable · pagination",
    },
    {
      name: "ImageOutput",
      icon: ImageIcon,
      desc: "Renders an inline, previewable image.",
      props: "format · downloadable (default true)",
    },
    {
      name: "AudioOutput",
      icon: Music,
      desc: "Renders an inline audio player.",
      props: "downloadable (default true)",
    },
    {
      name: "VideoOutput",
      icon: Video,
      desc: "Renders an inline video player.",
      props: "downloadable (default true)",
    },
    {
      name: "FileOutput",
      icon: FileIcon,
      desc: "Generic downloadable file.",
      props: "extension · downloadable (default true)",
    },
    {
      name: "PDFOutput",
      icon: FileType,
      desc: "Downloadable PDF document.",
      props: "downloadable (default true)",
    },
    {
      name: "CSVOutput",
      icon: FileSpreadsheet,
      desc: "Downloadable CSV file.",
      props: "downloadable (default true)",
    },
    {
      name: "ZIPOutput",
      icon: FileArchive,
      desc: "Downloadable ZIP archive.",
      props: "downloadable (default true)",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white antialiased">
      {/* Google Cursive Font Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap");
        .font-cursive {
          font-family: "Caveat", cursive, sans-serif;
        }
      `}</style>

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-3.5">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white transition-transform group-hover:scale-105">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm sm:text-base font-black tracking-tight text-zinc-950">
              DeployGent
              <span className="font-cursive text-lg sm:text-xl text-zinc-500 font-normal ml-0.5">
                .ai
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-200 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
            >
              Dashboard
            </Link>

            <Link
              href="/projects/new"
              className="rounded-lg bg-zinc-950 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 shrink-0"
            >
              Deploy Agent
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-12">
        {/* Hero */}
        <div className="border-b border-zinc-200 pb-10 sm:pb-16">
          <span className="inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-600">
            Documentation
          </span>

          <h1 className="mt-4 sm:mt-6 text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-950 leading-[0.95] uppercase">
            Build. <br />
            Deploy. <br />
            Execute
            <span className="font-cursive text-3xl xs:text-4xl sm:text-7xl lowercase text-zinc-500 font-normal ml-2 block sm:inline">
              seamlessly
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600">
            DeployGent automatically parses Python AI agent modules, extracts task
            metadata, generates web execution forms, and handles runtime infrastructure.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/projects/new"
              className="group flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 text-center"
            >
              Get Started
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-zinc-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 transition hover:bg-zinc-50 text-center"
            >
              Homepage
            </Link>
          </div>
        </div>

        {/* Anchor Quick Navigation */}
        <div className="py-8 sm:py-12 border-b border-zinc-200">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-4 sm:mb-6">
            Quick Index
          </span>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
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
                className="rounded border border-zinc-200 bg-zinc-50/50 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-mono font-medium text-zinc-700 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950 truncate"
              >
                # {item}
              </a>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-12 sm:space-y-20 py-10 sm:py-16 max-w-4xl">
          {/* Introduction */}
          <section id="getting-started" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <BookOpen size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Getting Started
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 font-normal">
              DeployGent turns standard Python repositories into production-ready agent endpoints. The platform clones your code repository, installs dependencies via standard requirements files, inspects module decorators via AST analysis, and hosts an interactive web playground automatically.
            </p>
          </section>

          {/* Installation */}
          <section id="installation" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Package size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Installation
              </h2>
            </div>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-3.5 sm:p-4 text-white shadow-md">
              <button
                onClick={() => copyToClipboard("pip install deploygent", "install")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Copy code"
              >
                {copiedId === "install" ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto pr-8">
                pip install deploygent
              </pre>
            </div>
          </section>

          {/* Quick Start */}
          <section id="quick-start" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Rocket size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Quick Start
              </h2>
            </div>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-3.5 sm:p-4 text-white shadow-md">
              <button
                onClick={() =>
                  copyToClipboard(
                    `from deploygent import Agent\n\nagent = Agent(\n    name="Summarizer",\n    description="Summarize long documents."\n)\n\nagent.serve()`,
                    "quickstart"
                  )
                }
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Copy code"
              >
                {copiedId === "quickstart" ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto pr-8 leading-relaxed">
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
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Boxes size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Agent Specification
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 font-normal">
              Every DeployGent repository exposes an initialized Agent instance. The Agent class aggregates operational metadata, registered tasks, runtime parameters, and standard IO bindings required to auto-render input interfaces.
            </p>
          </section>

          {/* Tasks */}
          <section id="tasks" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Play size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Task Registration
              </h2>
            </div>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-3.5 sm:p-4 text-white shadow-md">
              <button
                onClick={() =>
                  copyToClipboard(
                    `@agent.task\ndef summarize(text: str) -> str:\n    return text`,
                    "tasks"
                  )
                }
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Copy code"
              >
                {copiedId === "tasks" ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto pr-8 leading-relaxed">
{`@agent.task
def summarize(text: str) -> str:
    return text`}
              </pre>
            </div>
          </section>

          {/* Inputs */}
          <section id="inputs" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-2">
              <List size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Input Components
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 font-normal mb-4 sm:mb-6">
              Declare task parameters using any of the following input types. Every
              input accepts <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">label</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">placeholder</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">description</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">required</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">default</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">disabled</code>, and{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">hidden</code>, plus the
              type-specific properties listed below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inputComponents.map((item) => (
                <div
                  key={item.name}
                  className="group rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 sm:p-4 transition hover:border-zinc-950 hover:bg-white"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <item.icon
                      size={16}
                      className="text-zinc-500 group-hover:text-zinc-950 shrink-0"
                    />
                    <span className="font-mono text-xs font-bold text-zinc-950 truncate">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 break-all">
                    {item.props}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Outputs */}
          <section id="outputs" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-2">
              <Code2 size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Output Renderers
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 font-normal mb-4 sm:mb-6">
              Return any of the following output types from a task to control how the
              result is rendered in the playground. Every output accepts{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">title</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">description</code>,{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">downloadable</code>, and{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs">preview</code>, plus the
              type-specific properties listed below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {outputComponents.map((item) => (
                <div
                  key={item.name}
                  className="group rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 sm:p-4 transition hover:border-zinc-950 hover:bg-white"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <item.icon
                      size={16}
                      className="text-zinc-500 group-hover:text-zinc-950 shrink-0"
                    />
                    <span className="font-mono text-xs font-bold text-zinc-950 truncate">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 break-all">
                    {item.props}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Runtime */}
          <section id="runtime" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Server size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Runtime Management
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 font-normal">
              DeployGent allocates dedicated execution ports, spawns isolated worker sub-processes, monitors execution state, and generates strict OpenAPI REST specifications for every agent deployed.
            </p>
          </section>

          {/* Deployment */}
          <section id="deployment" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-zinc-950 mb-3 sm:mb-4">
              Deploying via CLI
            </h2>
            <div className="relative rounded-lg border border-zinc-950 bg-zinc-950 p-3.5 sm:p-4 text-white shadow-md">
              <button
                onClick={() => copyToClipboard("deploygent deploy", "deploy")}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Copy code"
              >
                {copiedId === "deploy" ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
              <pre className="font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto pr-8">
                deploygent deploy
              </pre>
            </div>
          </section>

          {/* CLI Commands */}
          <section id="cli" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Terminal size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
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
                  className="rounded border border-zinc-200 bg-zinc-50/50 p-3 font-mono text-xs text-zinc-950 font-semibold overflow-x-auto"
                >
                  $ {cmd}
                </div>
              ))}
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="scroll-mt-24">
            <div className="flex items-center gap-2.5 text-zinc-950 mb-3 sm:mb-4">
              <Code2 size={22} className="shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded border border-zinc-200 bg-white p-3 font-mono text-xs"
                >
                  <span className="font-bold text-zinc-950">
                    <span className="text-zinc-500 mr-2">{route.method}</span>
                    {route.path}
                  </span>
                  <span className="text-zinc-500 text-[11px] sm:text-xs">
                    {route.desc}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section id="examples" className="scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-zinc-950 mb-4 sm:mb-6">
              Agent Templates
            </h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
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
                  className="group rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 transition hover:border-zinc-950"
                >
                  <h3 className="font-bold text-zinc-950 text-base">{example}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Standard DeployGent agent implementation template.
                  </p>
                  <button className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-950 group-hover:underline cursor-pointer">
                    View Template
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <footer className="mt-12 sm:mt-20 border-t border-zinc-200 pt-8 sm:pt-12 pb-16 sm:pb-20">
          <div className="rounded-2xl border border-zinc-950 bg-zinc-950 p-6 sm:p-10 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-tight">
              Ready to deploy your first AI Agent?
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-zinc-400">
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