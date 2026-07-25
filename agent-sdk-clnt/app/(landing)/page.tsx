"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Server,
  Zap,
  ShieldCheck,
  Code2,
  Globe,
  Layers,
} from "lucide-react";

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-base shadow-sm">
              D
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              DeployGent
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <Link href="/dashboard/repositories" className="hover:text-white transition-colors">
              Repository Browser
            </Link>
            <Link href="/dashboard/playground" className="hover:text-white transition-colors">
              SDK Playground
            </Link>
            <Link href="/dashboard/runtimes" className="hover:text-white transition-colors">
              Runtime Manager
            </Link>
            <Link href="/dashboard/logs" className="hover:text-white transition-colors">
              Live Logs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-xs rounded-lg transition-all shadow-sm"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>Deploy with GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Production AI Agent Deployment Platform</span>
          <span className="text-zinc-500">•</span>
          <span className="text-indigo-400">v2.5.0</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
          Deploy AI Agents to Production with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            GitHub & Next.js
          </span>
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          DeployGent provides an end-to-end platform for deploying, inspecting, and managing autonomous AI agent runtimes with live streaming logs, auto-generated SDK playgrounds, and zero configuration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl group"
          >
            <GitHubIcon className="w-5 h-5" />
            <span>Connect GitHub Account</span>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/playground"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 font-semibold text-sm rounded-xl transition-all"
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Open SDK Playground</span>
          </Link>
        </div>
      </section>

      {/* Code & Terminal Preview Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="border border-zinc-800 bg-zinc-900/90 rounded-2xl p-4 md:p-6 shadow-2xl space-y-3 font-mono text-xs text-zinc-300 overflow-x-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-500 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-xs text-zinc-400">agent.py — DeployGent SDK</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">STATUS: ACTIVE RUNTIME</span>
          </div>

          <pre className="text-zinc-200 leading-relaxed">
{`from deploygent import Agent, Task, TextInput, TextAreaInput

agent = Agent(name="Production Assistant", version="2.5.0")

@agent.task
def generate_summary(prompt: TextAreaInput(label="Input Document")) -> str:
    """Executes AI agent pipeline with streaming response."""
    return agent.run_pipeline(prompt)

if __name__ == "__main__":
    agent.serve(port=8000)`}
          </pre>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/80 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Architected for Developer Productivity
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Everything you need to ship, run, and scale AI agent workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <GitHubIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">GitHub App Integration</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Fine-grained OAuth, automatic repository synchronization, and webhook events with RS256 JWT security.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Runtime Manager</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track independent agent runtimes with process, Docker, and Kubernetes driver abstractions and 5-second health checks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">ANSI Live Log Viewer</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Railway and Vercel inspired log streaming with virtualized rendering for 10,000+ lines, ANSI colors, and pause/search.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} DeployGent Inc. Built for high-performance agentic engineering.
      </footer>
    </div>
  );
}
