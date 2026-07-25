"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Rocket,
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function NewProjectPage() {
  const router = useRouter();

  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  async function deploy() {
    if (!repoUrl.trim()) return;

    setLoading(true);
    setLogs([]);

    try {
      const projectId = crypto.randomUUID();

      setLogs((p) => [...p, "Creating deployment..."]);

      const res = await fetch(`${API}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          repo_url: repoUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Deployment failed");
      }

      const data = await res.json();

      setLogs((p) => [...p, "Repository accepted"]);
      setLogs((p) => [...p, "Deployment queued"]);

      router.push(`/projects/${data.deployment_id}`);
    } catch (err: any) {
      setLogs((p) => [...p, err.message || "An error occurred"]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white antialiased pb-24">
      {/* Subtle Background Texture */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <div>
            <Link
              href="/projects"
              className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-zinc-950"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase">
              Deploy New Agent
            </h1>

            <p className="mt-1 text-sm text-zinc-500 font-normal">
              Paste a GitHub repository URL and DeployGent will handle the rest.
            </p>
          </div>

          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-950 shadow-sm">
            <Rocket size={22} />
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="mx-auto grid max-w-6xl gap-8 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Column: Input Form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2.5">
              <GithubIcon className="w-5 h-5 text-zinc-950" />
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                Repository
              </h2>
            </div>

            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              Public GitHub repository containing your DeployGent agent.
            </p>

            <div className="mt-6">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50/50 px-4 font-mono text-sm text-zinc-950 placeholder-zinc-400 outline-none transition focus:border-zinc-950 focus:bg-white"
              />
            </div>

            <button
              disabled={loading || !repoUrl.trim()}
              onClick={deploy}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket size={16} />
                  Deploy Agent
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950">
              What happens after clicking Deploy?
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Clone repository
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Create virtual environment
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Install dependencies
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Extract metadata
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Start runtime
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Allocate port
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                Generate playground
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deployment Log & Activity */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Deployment Activity
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live deployment events.
            </p>

            <div className="mt-6 space-y-3 min-h-[160px]">
              {logs.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-200 font-mono text-xs uppercase tracking-widest text-zinc-400">
                  Waiting for deployment...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-xs text-zinc-800"
                  >
                    {loading && index === logs.length - 1 ? (
                      <CircleDashed
                        className="animate-spin text-zinc-950"
                        size={16}
                      />
                    ) : (
                      <CheckCircle2 className="text-zinc-950" size={16} />
                    )}
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-950">
              Deployment Engine
            </h3>

            <div className="mt-4 divide-y divide-zinc-100 font-mono text-xs">
              <div className="flex justify-between py-2 text-zinc-600">
                <span>Worker</span>
                <span className="font-bold text-zinc-950">ONLINE</span>
              </div>
              <div className="flex justify-between py-2 text-zinc-600">
                <span>Metadata Extraction</span>
                <span className="font-bold text-zinc-950">ENABLED</span>
              </div>
              <div className="flex justify-between py-2 text-zinc-600">
                <span>Automatic Playground</span>
                <span className="font-bold text-zinc-950">ENABLED</span>
              </div>
              <div className="flex justify-between py-2 text-zinc-600">
                <span>Runtime Manager</span>
                <span className="font-bold text-zinc-950">ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}