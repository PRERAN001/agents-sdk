"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ArrowUpRight,
  BookOpen,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  Workflow,
  Boxes,
  LogOut,
  User,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden antialiased">
      {/* Background Subtle Grid Texture */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-950 text-white">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950">
              DeployGent
            </span>
          </div>

          <div className="hidden gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:flex">
            <Link href="#features" className="transition hover:text-zinc-950">Features</Link>
            <Link href="/docs" className="transition hover:text-zinc-950">Docs</Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-zinc-950">GitHub</Link>
            <Link href="/dashboard" className="transition hover:text-zinc-950">Dashboard</Link>
          </div>

          <div className="flex items-center gap-3">
            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="w-7 h-7 rounded-full border border-zinc-300"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-zinc-800 hidden sm:inline">
                    {session.user.name}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 cursor-pointer shadow-sm"
              >
                <GithubIcon className="w-4 h-4 fill-current" />
                <span>Sign In with GitHub</span>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto border-b border-zinc-200/80">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-8 py-24 lg:flex-row lg:items-center lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs font-medium text-zinc-700">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              NO DOCKER • NO INFRASTRUCTURE • NO DEPOPS
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-zinc-950 sm:text-7xl lg:text-8xl leading-[0.95] uppercase">
              Deploy <br />
              Python AI <br />
              Agents.
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-zinc-600 max-w-xl font-normal">
              DeployGent turns standard Python repositories into managed production runtimes. Auto-generated playgrounds, isolated tasks, zero DevOps overhead.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-lg bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Start Deployment
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/docs"
                className="rounded-lg border border-zinc-300 bg-white px-6 py-3.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-50"
              >
                Read Documentation
              </Link>
            </div>
          </motion.div>

          {/* Terminal Box - Editorial Styled */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-xl lg:w-1/2"
          >
            <div className="rounded-xl border border-zinc-950 bg-zinc-950 p-6 shadow-xl text-zinc-100">
              <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="font-mono text-xs text-zinc-400">deploygent-runtime</span>
              </div>

              <pre className="space-y-2 font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto">
{`$ deploygent deploy

[01/05] Cloning repo... DONE
[02/05] Creating venv... DONE
[03/05] Installing requirements.txt... DONE
[04/05] Extracting task metadata... DONE
[05/05] Spawning agent runtime... DONE

➜ Live endpoint: https://agent.deploygent.run:9012`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Tech Bar */}
      <section className="border-b border-zinc-200/80 bg-zinc-50/50 py-8">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {["OpenAI", "Anthropic", "Google", "AWS", "Docker", "GitHub", "MongoDB", "Python"].map((tech) => (
              <span key={tech} className="transition hover:text-zinc-950 cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-b border-zinc-200/80 py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">Core Architecture</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              Engineered for simplicity and scale.
            </h2>
          </div>

          <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Rocket size={20} className="text-zinc-950" />,
                title: "One-Click Deployments",
                desc: "Connect your repository URL and let DeployGent inspect requirements and boot your agent.",
              },
              {
                icon: <Workflow size={20} className="text-zinc-950" />,
                title: "Auto Playgrounds",
                desc: "UI interfaces generated automatically from your Python function inputs and metadata.",
              },
              {
                icon: <Boxes size={20} className="text-zinc-950" />,
                title: "Dynamic Task Manager",
                desc: "Execute long-running or immediate tasks directly through standard browser payloads.",
              },
              {
                icon: <Server size={20} className="text-zinc-950" />,
                title: "Isolated Ports & Runtimes",
                desc: "Every runtime gets an allocated port and isolated runtime process automatically.",
              },
              {
                icon: <Terminal size={20} className="text-zinc-950" />,
                title: "Real-time Build Streams",
                desc: "Inspect dependency installs, system logs, and task outputs in real time.",
              },
              {
                icon: <Sparkles size={20} className="text-zinc-950" />,
                title: "Zero Config Needed",
                desc: "Skip writing Dockerfiles, configuring Nginx routes, or writing custom API wrappers.",
              },
            ].map((feature) => (
              <div key={feature.title} className="group border-t border-zinc-200 pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-zinc-200 bg-zinc-50">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="border-b border-zinc-200/80 bg-zinc-50/50 py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">Pipeline</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              From code to executable in seconds.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Paste Repository", desc: "Provide your public or private GitHub repository link." },
              { step: "02", title: "Worker Processing", desc: "Dependencies and agent metadata are analyzed automatically." },
              { step: "03", title: "Runtime Launch", desc: "An isolated process is initialized on an allocated port." },
              { step: "04", title: "Playground Live", desc: "Access your auto-built interface and run tasks immediately." },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <span className="font-mono text-2xl font-black text-zinc-950">{item.step}</span>
                <h3 className="mt-4 text-sm font-bold text-zinc-950 uppercase tracking-wide">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-8">
          <div className="rounded-2xl border border-zinc-950 bg-zinc-950 p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl uppercase">
              Ready to deploy your agents?
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400 font-normal leading-relaxed">
              Ship your Python AI projects with structured runtimes, instant interfaces, and zero operational overhead.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition hover:bg-zinc-200"
                >
                  Go To Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => signIn("github")}
                  className="rounded-lg bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition hover:bg-zinc-200 flex items-center gap-2 cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4 fill-current" />
                  <span>Sign In with GitHub</span>
                </button>
              )}

              <Link
                href="/docs"
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
              >
                <BookOpen size={14} />
                Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 text-xs font-medium text-zinc-500 md:flex-row">
          <span>© 2026 DeployGent Systems Inc. All rights reserved.</span>

          <div className="flex gap-6">
            <Link href="/docs" className="transition hover:text-zinc-950">Documentation</Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-zinc-950">GitHub</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}