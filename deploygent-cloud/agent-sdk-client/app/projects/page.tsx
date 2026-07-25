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
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch(`${API}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center gap-3 font-sans">
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase">
              Projects
            </h1>
            <p className="mt-1 text-sm text-zinc-500 font-normal">
              All deployed DeployGent agents and active instances.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
          >
            <Plus size={16} />
            New Deployment
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-8 py-10">
        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-16 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm">
              <Rocket size={20} />
            </div>

            <h2 className="mt-4 text-xl font-bold tracking-tight text-zinc-950 uppercase">
              No Projects Found
            </h2>

            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
              Deploy your first AI agent directly from a GitHub repository.
            </p>

            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              <Plus size={14} />
              Deploy Now
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: any) => (
            <Link
              key={project.project_id}
              href={`/projects/${project.project_id}`}
              className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-7 shadow-sm transition-all duration-200 hover:border-zinc-950 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded border border-zinc-200 bg-zinc-50 font-mono text-xs font-bold text-zinc-950">
                    /{project.name ? project.name.charAt(0).toUpperCase() : "A"}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
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

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-zinc-950 group-hover:underline">
                  {project.name}
                </h2>

                <p className="mt-1 font-mono text-xs text-zinc-400">
                  ID: {project.project_id}
                </p>

                <div className="mt-8 space-y-2 border-t border-zinc-100 pt-6 font-mono text-xs text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Server size={14} className="text-zinc-400" />
                      Port
                    </span>
                    <span className="font-bold text-zinc-950">{project.port}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-zinc-400" />
                      Created
                    </span>
                    <span className="text-zinc-500">{project.created_at}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-bold uppercase tracking-wider text-zinc-950">
                <span>View Agent</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}