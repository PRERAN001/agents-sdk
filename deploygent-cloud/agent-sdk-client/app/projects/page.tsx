"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Rocket,
  Server,
  Clock,
  Plus,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Project {
  project_id: string;
  name?: string;
  status: string;
  port: number | string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(e: React.MouseEvent, projectId: string) {
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm(
      "Delete this project? This action cannot be undone.",
    );

    if (!ok) return;

    try {
      const res = await fetch(`${API}/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prev) =>
        prev.filter((p) => p.project_id !== projectId),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  }

  async function fetchProjects() {
    try {
      const res = await fetch(`${API}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } font-mono {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center gap-3 font-sans px-4">
        <Loader2 className="animate-spin text-zinc-950" size={32} />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Fetching Projects...
        </span>
      </main>
    );

  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-950 selection:text-white antialiased pb-24">
      {/* Background Grid Pattern */}
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
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 uppercase">
              Projects
            </h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500 font-normal">
              All deployed DeployGent agents and active instances.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 shrink-0"
          >
            <Plus size={16} />
            New Deployment
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 py-6 sm:py-10">
        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 sm:p-16 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm">
              <Rocket size={20} />
            </div>

            <h2 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-zinc-950 uppercase">
              No Projects Found
            </h2>

            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Deploy your first AI agent directly from a GitHub repository.
            </p>

            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              <Plus size={14} />
              Deploy Now
            </Link>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.project_id}
              onClick={() => router.push(`/projects/${project.project_id}`)}
              className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-sm transition-all duration-200 hover:border-zinc-950 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 font-mono text-xs font-bold text-zinc-950">
                    /{project.name ? project.name.charAt(0).toUpperCase() : "A"}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                      project.status === "running"
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        project.status === "running"
                          ? "bg-white animate-pulse"
                          : "bg-zinc-400"
                      }`}
                    />
                    {project.status}
                  </div>
                </div>

                <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 group-hover:underline truncate">
                  {project.name || "Untitled Agent"}
                </h2>

                <p className="mt-1 font-mono text-xs text-zinc-400 truncate">
                  ID: {project.project_id}
                </p>

                <div className="mt-6 sm:mt-8 space-y-2 border-t border-zinc-100 pt-4 sm:pt-6 font-mono text-xs text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Server size={14} className="text-zinc-400" />
                      Port
                    </span>
                    <span className="font-bold text-zinc-950">
                      {project.port}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-zinc-400" />
                      Created
                    </span>
                    <span className="text-zinc-500 truncate max-w-[150px] text-right">
                      {project.created_at}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-between border-t border-zinc-100 pt-4">
                <button
                  onClick={(e) => handleDelete(e, project.project_id)}
                  className="flex items-center gap-1.5 rounded-md border border-red-200 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={13} />
                  Delete
                </button>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-950">
                  <span>View Agent</span>

                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}