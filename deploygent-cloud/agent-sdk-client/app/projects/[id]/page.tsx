"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Loader2,
  Rocket,
  Activity,
  Globe,
  Server,
  Terminal,
  ArrowLeft,
  ExternalLink,
  Play,
  Code2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();

    const interval = setInterval(fetchProject, 3000);

    return () => clearInterval(interval);
  }, []);

  async function fetchProject() {
    try {
      const res = await fetch(`${API}/deployment/${id}`);
      const data = await res.json();
      console.log("id page",data)
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center gap-3 font-sans">
        <Loader2 className="animate-spin text-zinc-950" size={32} />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Loading Instance Details...
        </span>
      </main>
    );

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white antialiased pb-24">
      {/* Background Subtle Grid Texture */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <Link
              href="/projects"
              className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-zinc-950"
            >
              <ArrowLeft size={14} />
              Back to Projects
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase">
              {project?.name || "Agent Instance"}
            </h1>

            <p className="mt-1 font-mono text-xs text-zinc-400">
              ID: {project?.project_id}
            </p>
          </div>

          <Link
            href={`/projects/${project?.id}/playground`}
            className="flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
          >
            <Play size={14} />
            Open Playground
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 pt-10 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Status
              </span>
              <Activity size={18} className="text-zinc-950" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  project?.status === "running"
                    ? "bg-zinc-950 animate-pulse"
                    : "bg-zinc-400"
                }`}
              />
              <span className="font-mono text-2xl font-black uppercase text-zinc-950">
                {project?.status}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Port
              </span>
              <Server size={18} className="text-zinc-950" />
            </div>

            <h2 className="mt-4 font-mono text-3xl font-black text-zinc-950">
              {project?.runtime?.port ?? "N/A"}
            </h2>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Runtime URL
              </span>
              <Globe size={18} className="text-zinc-950" />
            </div>

            <a
              href={project?.runtime?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-bold text-zinc-950 hover:underline truncate max-w-full"
            >
              <span className="truncate">{project?.runtime?.url || "N/A"}</span>
              <ExternalLink size={14} className="shrink-0" />
            </a>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Tasks
              </span>
              <Rocket size={18} className="text-zinc-950" />
            </div>

            <h2 className="mt-4 font-mono text-3xl font-black text-zinc-950">
              {project?.metadata?.tasks?.length ?? 0}
            </h2>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Code2 size={20} className="text-zinc-950" />
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Available Tasks
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {project?.metadata?.tasks?.map((task: any) => (
              <div
                key={task.name}
                className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 transition hover:border-zinc-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-950 tracking-tight">
                    {task.name}
                  </h3>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-200 bg-white px-2 py-0.5 rounded">
                    {task.inputs?.length ?? 0} INPUTS
                  </span>
                </div>

                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                  {task.description || "No description provided."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Runtime Diagnostics */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Terminal size={20} className="text-zinc-950" />
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Runtime Process Configuration
            </h2>
          </div>

          <div className="grid gap-3 font-mono text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                HOST
              </span>
              <span className="font-bold text-zinc-950">
                {project?.runtime?.host || "localhost"}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                PORT
              </span>
              <span className="font-bold text-zinc-950">
                {project?.runtime?.port || "N/A"}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 truncate">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                URL
              </span>
              <span className="font-bold text-zinc-950 truncate block">
                {project?.runtime?.url || "N/A"}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                PID
              </span>
              <span className="font-bold text-zinc-950">
                {project?.runtime?.pid || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* JSON Metadata Output */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
              Raw Metadata Inspect
            </h2>
            <span className="font-mono text-xs font-semibold text-zinc-400 uppercase">
              AST AST_SPEC_V1
            </span>
          </div>

          <pre className="overflow-auto rounded-lg border border-zinc-950 bg-zinc-950 p-6 font-mono text-xs leading-relaxed text-zinc-200 shadow-inner max-h-96">
            {JSON.stringify(project?.metadata, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}