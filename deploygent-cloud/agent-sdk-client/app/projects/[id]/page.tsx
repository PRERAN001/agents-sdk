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

      setProject(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={42} />
      </main>
    );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div>
            <Link
              href="/projects"
              className="mb-3 inline-flex items-center gap-2 text-white/50 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

            <h1 className="text-4xl font-bold">
              {project.name}
            </h1>

            <p className="mt-2 text-white/50">
              {project.project_id}
            </p>
          </div>

          <Link
            href={`/projects/${project.project_id}/playground`}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black"
          >
            <Play size={18} />
            Open Playground
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-10">

        {/* Overview */}

        <div className="grid gap-6 lg:grid-cols-4">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <Activity />

            <p className="mt-6 text-white/50">
              Status
            </p>

            <h2
              className={`mt-3 text-3xl font-bold ${
                project.status === "running"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {project.status}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <Server />

            <p className="mt-6 text-white/50">
              Port
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {project.runtime.port}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <Globe />

            <p className="mt-6 text-white/50">
              Runtime URL
            </p>

            <a
              href={project.runtime.url}
              target="_blank"
              className="mt-3 flex items-center gap-2 break-all text-lg text-white hover:underline"
            >
              {project.runtime.url}

              <ExternalLink size={16} />
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <Rocket />

            <p className="mt-6 text-white/50">
              Tasks
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {project.metadata.tasks.length}
            </h2>
          </div>
        </div>

        {/* Metadata */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            Agent Metadata
          </h2>

          <pre className="mt-8 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-white/70">
            {JSON.stringify(project.metadata, null, 2)}
          </pre>
        </div>

        {/* Tasks */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            Available Tasks
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {project.metadata.tasks.map(
              (task: any) => (
                <div
                  key={task.name}
                  className="rounded-2xl border border-white/10 bg-black/30 p-6"
                >
                  <h3 className="text-2xl font-semibold">
                    {task.name}
                  </h3>

                  <p className="mt-3 text-white/50">
                    {task.description}
                  </p>

                  <p className="mt-6 text-sm text-white/40">
                    Inputs : {task.inputs.length}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Runtime */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="flex items-center gap-3">

            <Terminal />

            <h2 className="text-2xl font-semibold">
              Runtime
            </h2>

          </div>

          <div className="mt-8 space-y-4 text-white/60">

            <p>
              Host : {project.runtime.host}
            </p>

            <p>
              Port : {project.runtime.port}
            </p>

            <p>
              URL : {project.runtime.url}
            </p>

            <p>
              PID : {project.runtime.pid}
            </p>

          </div>

        </div>

      </section>
    </main>
  );
}