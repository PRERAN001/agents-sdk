"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Home() {
  const { data: session, status } = useSession();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleGitHubSignIn() {
    if (!verified || !turnstileToken) {
      alert("Please verify you're human.");
      return;
    }

    const res = await fetch("/api/turnstile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: turnstileToken,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      alert("Human verification failed.");
      return;
    }

    signIn("github");
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white overflow-x-hidden antialiased">
      {/* Custom Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap");
        .font-cursive {
          font-family: "Caveat", cursive, sans-serif;
        }
        /* Utility to hide scrollbar on marquee/tech bar for mobile */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Subtle Grid Background */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `28px 28px`,
        }}
      />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[#faf8f5]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-3.5">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white transition-transform group-hover:scale-105">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="text-base font-black tracking-tight text-zinc-950">
              DeployGent
              <span className="font-cursive text-xl text-zinc-500 font-normal ml-0.5">
                .ai
              </span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <Link href="#features" className="transition hover:text-zinc-950">
              Features
            </Link>
            <Link href="/docs" className="transition hover:text-zinc-950">
              Docs
            </Link>
            <Link
              href="https://github.com/PRERAN001/agents-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-950"
            >
              GitHub
            </Link>
            <Link href="/dashboard" className="transition hover:text-zinc-950">
              Dashboard
            </Link>
          </div>

          {/* Header Action Buttons & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {status === "authenticated" && session?.user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="h-7 w-7 rounded-full border border-zinc-300 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 font-mono text-xs font-bold text-white">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}

                  <span className="hidden font-mono text-xs font-bold text-zinc-800 lg:inline">
                    {session.user.name}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block scale-90 sm:scale-100 origin-right">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => {
                      setTurnstileToken(token);
                      setVerified(true);
                    }}
                    onExpire={() => {
                      setVerified(false);
                      setTurnstileToken("");
                    }}
                  />
                </div>

                <button
                  onClick={handleGitHubSignIn}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-zinc-950 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!verified}
                >
                  <GithubIcon className="h-3.5 w-3.5 fill-current" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden p-1.5 text-zinc-800 hover:bg-zinc-200/60 rounded-md transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Turnstile Bar (Shows only on mobile if unauthenticated) */}
        {status !== "authenticated" && (
          <div className="block sm:hidden border-t border-zinc-200/60 bg-[#faf8f5] py-2 px-4">
            <div className="flex justify-center scale-85 origin-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  setVerified(true);
                }}
                onExpire={() => {
                  setVerified(false);
                  setTurnstileToken("");
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-zinc-200 bg-[#faf8f5] px-6 py-4 md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 transition hover:text-zinc-950"
                >
                  Features
                </Link>
                <Link
                  href="/docs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 transition hover:text-zinc-950"
                >
                  Docs
                </Link>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 transition hover:text-zinc-950"
                >
                  GitHub
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 transition hover:text-zinc-950"
                >
                  Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative border-b-2 border-zinc-950 overflow-hidden">
        {/* Floating Accent Note (Desktop Only) */}
        <motion.div
          initial={{ rotate: -6, opacity: 0, y: -20 }}
          animate={{ rotate: -6, opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden xl:block absolute right-12 top-10 w-52 bg-amber-100 border-2 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10"
        >
          <p className="font-cursive text-2xl text-zinc-900 leading-tight">
            "Finally, an agent runner that doesn't make me write Dockerfiles."
          </p>
          <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 mt-2 block">
            — Happy Python Dev
          </span>
        </motion.div>

        <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 sm:gap-12 px-4 sm:px-8 py-12 sm:py-20 lg:flex-row lg:items-center lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <div className="mb-4 sm:mb-6 inline-flex max-w-full items-center gap-2 border-2 border-zinc-950 bg-white px-3 sm:px-3.5 py-1.5 font-mono text-[10px] sm:text-xs font-bold tracking-wider text-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] break-words">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">ZERO DOCKER • ZERO INFRASTRUCTURE • ZERO DEVOPS</span>
            </div>

            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-950 leading-[0.95] sm:leading-[0.92] uppercase">
              Deploy <br />
              <span className="relative inline-block">
                Python AI
                <svg
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C50 3 150 3 197 9"
                    stroke="#000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <br className="hidden xs:inline" />
              Agents
              <span className="font-cursive text-3xl sm:text-5xl lg:text-7xl lowercase text-zinc-600 font-normal ml-2 block sm:inline">
                effortlessly
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-zinc-700 max-w-xl font-normal">
              DeployGent turns Python repositories into interactive production
              runtimes. Auto-generated playgrounds, isolated tasks, and zero
              operational overhead.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-950 bg-zinc-950 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none text-center"
              >
                Start Deployment
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href="/docs"
                className="rounded-xl border-2 border-zinc-950 bg-white px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none text-center"
              >
                Read Documentation
              </Link>
            </div>
          </motion.div>

          {/* Terminal Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-1/2 max-w-xl"
          >
            <div className="rounded-2xl border-2 border-zinc-950 bg-zinc-950 p-4 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-zinc-100 relative">
              <div className="mb-3 sm:mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full bg-rose-500" />
                  <div className="h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full bg-amber-500" />
                  <div className="h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-zinc-400">
                  deploygent-cli v1.0.0
                </span>
              </div>

              <pre className="space-y-2 font-mono text-[11px] xs:text-xs sm:text-sm text-zinc-300 overflow-x-auto leading-relaxed pb-1">
                {`$ deploygent deploy

[01/05] Cloning repo... DONE
[02/05] Creating venv... DONE
[03/05] Installing requirements.txt... DONE
[04/05] Extracting task metadata... DONE
[05/05] Spawning agent runtime... DONE

➜ Live endpoint: https://agent.deploygent.run:9012`}
              </pre>

              <div className="mt-3 sm:mt-4 border-t border-zinc-800 pt-3 flex items-center justify-between font-cursive text-base sm:text-lg text-emerald-400">
                <span>✓ Agent Playground Ready</span>
                <span className="text-zinc-500 font-mono text-[10px] sm:text-xs">
                  Port 9012
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Responsive Tech Bar */}
      <section className="border-b-2 border-zinc-950 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar font-mono text-xs font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">
            {[
              "OpenAI",
              "Anthropic",
              "Google",
              "AWS",
              "Docker",
              "GitHub",
              "MongoDB",
              "Python",
            ].map((tech) => (
              <span
                key={tech}
                className="transition hover:text-zinc-950 cursor-default shrink-0"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="border-b-2 border-zinc-950 py-16 sm:py-24 bg-[#faf8f5]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-zinc-500">
              Core Architecture
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase leading-tight">
              Engineered for simplicity{" "}
              <span className="font-cursive text-3xl sm:text-4xl lg:text-5xl font-normal lowercase text-zinc-600 block sm:inline">
                & speed
              </span>
            </h2>
          </div>

          <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Rocket size={22} className="text-zinc-950" />,
                title: "One-Click Deployments",
                desc: "Connect your repository URL and let DeployGent inspect requirements and boot your agent.",
                note: "Zero configuration needed",
              },
              {
                icon: <Workflow size={22} className="text-zinc-950" />,
                title: "Auto Playgrounds",
                desc: "UI interfaces generated automatically from your Python function inputs and metadata.",
                note: "Generated in real time",
              },
              {
                icon: <Boxes size={22} className="text-zinc-950" />,
                title: "Dynamic Task Manager",
                desc: "Execute long-running or immediate tasks directly through standard browser payloads.",
                note: "Isolated task queues",
              },
              {
                icon: <Server size={22} className="text-zinc-950" />,
                title: "Isolated Runtimes",
                desc: "Every runtime gets an allocated port and isolated runtime process automatically.",
                note: "Automated port mapping",
              },
              {
                icon: <Terminal size={22} className="text-zinc-950" />,
                title: "Real-time Build Streams",
                desc: "Inspect dependency installs, system logs, and task outputs in real time.",
                note: "Live CLI streaming",
              },
              {
                icon: <Sparkles size={22} className="text-zinc-950" />,
                title: "Zero Config Needed",
                desc: "Skip writing Dockerfiles, configuring Nginx routes, or writing custom API wrappers.",
                note: "Just push pure Python",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border-2 border-zinc-950 bg-white p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex flex-col justify-between"
              >
                <div>
                  <div className="mb-5 sm:mb-6 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border-2 border-zinc-950 bg-amber-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 sm:mt-3 text-sm leading-relaxed text-zinc-700 font-normal">
                    {feature.desc}
                  </p>
                </div>
                <div className="mt-6 border-t-2 border-dashed border-zinc-200 pt-4">
                  <span className="font-cursive text-base sm:text-lg text-zinc-600 font-semibold">
                    ✨ {feature.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="border-b-2 border-zinc-950 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-zinc-500">
              Pipeline
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase leading-tight">
              From code to executable{" "}
              <span className="font-cursive text-3xl sm:text-4xl lg:text-5xl font-normal lowercase text-zinc-600 block sm:inline">
                in 4 steps
              </span>
            </h2>
          </div>

          <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Paste Repository",
                desc: "Provide your public or private GitHub repository link.",
              },
              {
                step: "02",
                title: "Worker Processing",
                desc: "Dependencies and agent metadata are analyzed automatically.",
              },
              {
                step: "03",
                title: "Runtime Launch",
                desc: "An isolated process is initialized on an allocated port.",
              },
              {
                step: "04",
                title: "Playground Live",
                desc: "Access your auto-built interface and run tasks immediately.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border-2 border-zinc-950 bg-[#faf8f5] p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <span className="font-mono text-2xl sm:text-3xl font-black text-zinc-950">
                  {item.step}
                </span>
                <h3 className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 sm:py-24 bg-[#faf8f5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl border-2 border-zinc-950 bg-zinc-950 p-6 sm:p-12 text-center text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
              Ready to deploy your agents?
            </h2>

            <p className="mx-auto mt-3 sm:mt-4 max-w-lg text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
              Ship your Python AI projects with structured runtimes, instant
              interfaces, and zero operational overhead.
            </p>

            <p className="font-cursive text-2xl sm:text-3xl text-amber-300 mt-3 sm:mt-4">
              It takes less than 60 seconds to launch.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="rounded-xl border-2 border-white bg-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition hover:bg-zinc-200 text-center"
                >
                  Go To Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => signIn("github")}
                  className="rounded-xl border-2 border-white bg-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition hover:bg-zinc-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4 fill-current" />
                  <span>Sign In with GitHub</span>
                </button>
              )}

              <Link
                href="/docs"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-800 bg-zinc-900 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 text-center"
              >
                <BookOpen size={14} />
                Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-zinc-950 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-8 text-xs font-bold text-zinc-600 md:flex-row text-center md:text-left">
          <span>© 2026 DeployGent Systems Inc. All rights reserved.</span>

          <div className="flex gap-6">
            <Link href="/docs" className="transition hover:text-zinc-950">
              Documentation
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-950"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}