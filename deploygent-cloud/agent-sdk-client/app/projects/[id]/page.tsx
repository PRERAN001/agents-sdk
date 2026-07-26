"use client";

import { useEffect, useState, useCallback } from "react";
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

interface TaskInput {
  name?: string;
  type?: string;
  required?: boolean;
}

interface Task {
  name: string;
  description?: string;
  inputs?: TaskInput[];
}

interface RuntimeInfo {
  port?: number | string;
  url?: string;
  host?: string;
  pid?: number | string;
}

interface ProjectData {
  id?: string;
  project_id?: string;
  name?: string;
  status?: string;
  runtime?: RuntimeInfo;
  metadata?: {
    tasks?: Task[];
    [key: string]: unknown;
  };
}

export default function ProjectPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`${API}/deployment/${id}`);
      const data = await res.json();
      console.log("id page", data);
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();

    const interval = setInterval(fetchProject, 3000);

    return () => clearInterval(interval);
  }, [fetchProject]);

  if (loading)
    return (
      <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center gap-3 font-sans px-4">
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
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6">
          <div>
            <Link
              href="/projects"
              className="mb-1.5 sm:mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-zinc-950"
            >
              <ArrowLeft size={14} />
              Back to Projects
            </Link>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 uppercase truncate max-w-xl">
              {project?.name || "Agent Instance"}
            </h1>

            <p className="mt-0.5 sm:mt-1 font-mono text-xs text-zinc-400 truncate">
              ID: {project?.project_id}
            </p>
          </div>

          <Link
            href={`/projects/${project?.id || id}/playground`}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 shrink-0"
          >
            <Play size={14} />
            Open Playground
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-8 pt-6 sm:pt-10 space-y-6 sm:space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Status
              </span>
              <Activity size={18} className="text-zinc-950" />
            </div>

            <div className="mt-3 sm:mt-4 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  project?.status === "running"
                    ? "bg-zinc-950 animate-pulse"
                    : "bg-zinc-400"
                }`}
              />
              <span className="font-mono text-xl sm:text-2xl font-black uppercase text-zinc-950 truncate">
                {project?.status || "UNKNOWN"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Port
              </span>
              <Server size={18} className="text-zinc-950" />
            </div>

            <h2 className="mt-3 sm:mt-4 font-mono text-2xl sm:text-3xl font-black text-zinc-950">
              {project?.runtime?.port ?? "N/A"}
            </h2>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Runtime URL
              </span>
              <Globe size={18} className="text-zinc-950" />
            </div>

            {project?.runtime?.url ? (
              <a
                href={project.runtime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-zinc-950 hover:underline truncate max-w-full"
              >
                <span className="truncate">{project.runtime.url}</span>
                <ExternalLink size={14} className="shrink-0" />
              </a>
            ) : (
              <span className="mt-3 sm:mt-4 block font-mono text-2xl sm:text-3xl font-black text-zinc-950">
                N/A
              </span>
            )}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Tasks
              </span>
              <Rocket size={18} className="text-zinc-950" />
            </div>

            <h2 className="mt-3 sm:mt-4 font-mono text-2xl sm:text-3xl font-black text-zinc-950">
              {project?.metadata?.tasks?.length ?? 0}
            </h2>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
            <Code2 size={20} className="text-zinc-950 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
              Available Tasks
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {project?.metadata?.tasks && project.metadata.tasks.length > 0 ? (
              project.metadata.tasks.map((task) => (
                <div
                  key={task.name}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 sm:p-6 transition hover:border-zinc-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight truncate">
                      {task.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-200 bg-white px-2 py-0.5 rounded shrink-0">
                      {task.inputs?.length ?? 0} INPUTS
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>
              ))
            ) : (
              <p className="font-mono text-xs text-zinc-400 py-4 col-span-full">
                No tasks extracted for this agent.
              </p>
            )}
          </div>
        </div>

        {/* Runtime Diagnostics */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
            <Terminal size={20} className="text-zinc-950 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
              Runtime Process Configuration
            </h2>
          </div>

          <div className="grid gap-3 font-mono text-xs grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 sm:p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                HOST
              </span>
              <span className="font-bold text-zinc-950 truncate block">
                {project?.runtime?.host || "localhost"}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 sm:p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                PORT
              </span>
              <span className="font-bold text-zinc-950 block">
                {project?.runtime?.port || "N/A"}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 sm:p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                URL
              </span>
              <span className="font-bold text-zinc-950 truncate block">
                {project?.runtime?.url || "N/A"}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3.5 sm:p-4">
              <span className="text-zinc-400 block font-bold uppercase tracking-wider mb-1">
                PID
              </span>
              <span className="font-bold text-zinc-950 block">
                {project?.runtime?.pid || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* JSON Metadata Output */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
              Raw Metadata Inspect
            </h2>
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase">
              AST AST_SPEC_V1
            </span>
          </div>

          <pre className="overflow-x-auto rounded-lg border border-zinc-950 bg-zinc-950 p-4 sm:p-6 font-mono text-[11px] sm:text-xs leading-relaxed text-zinc-200 shadow-inner max-h-96">
            {JSON.stringify(project?.metadata, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}