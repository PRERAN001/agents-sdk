"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Activity,
  Server,
  FolderGit2,
  ArrowUpRight,
  Loader2,
  Plus,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface DashboardMetrics {
  projects?: number;
  deployments?: number;
  running?: number;
  stopped?: number;
}

interface DeploymentItem {
  project_id: string;
  name?: string;
  port?: number | string;
  status?: string;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [dashboardRes, deploymentRes] = await Promise.all([
        fetch(`${API}/dashboard`),
        fetch(`${API}/deployments`),
      ]);

      const dashboardData = await dashboardRes.json();
      console.log(dashboardData);
      const deploymentData = await deploymentRes.json();
      console.log(deploymentData);

      setDashboard(dashboardData);
      setDeployments(deploymentData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center gap-3 font-sans px-4">
        <Loader2 className="animate-spin text-zinc-950" size={32} />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Loading Overview...
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
              Dashboard
            </h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-zinc-500 font-normal">
              Overview of your deployed agents and system metrics.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800 shrink-0"
          >
            <Plus size={16} />
            Deploy Agent
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-8 pt-6 sm:pt-10">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition hover:border-zinc-300">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Projects
              </span>
              <FolderGit2 size={20} className="text-zinc-950 shrink-0" />
            </div>
            <p className="mt-3 sm:mt-4 font-mono text-3xl sm:text-4xl font-extrabold text-zinc-950">
              {dashboard?.projects ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition hover:border-zinc-300">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Deployments
              </span>
              <Rocket size={20} className="text-zinc-950 shrink-0" />
            </div>
            <p className="mt-3 sm:mt-4 font-mono text-3xl sm:text-4xl font-extrabold text-zinc-950">
              {dashboard?.deployments ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition hover:border-zinc-300">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Running
              </span>
              <Activity size={20} className="text-zinc-950 shrink-0" />
            </div>
            <p className="mt-3 sm:mt-4 font-mono text-3xl sm:text-4xl font-extrabold text-zinc-950">
              {dashboard?.running ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition hover:border-zinc-300">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Stopped
              </span>
              <Server size={20} className="text-zinc-500 shrink-0" />
            </div>
            <p className="mt-3 sm:mt-4 font-mono text-3xl sm:text-4xl font-extrabold text-zinc-400">
              {dashboard?.stopped ?? 0}
            </p>
          </div>
        </div>

        {/* Recent Deployments Table/List */}
        <div className="mt-8 sm:mt-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 sm:px-8 py-4 sm:py-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
                Recent Deployments
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500">
                Active and historical agent instances
              </p>
            </div>

            <Link
              href="/projects"
              className="group flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-600 transition hover:text-zinc-950 shrink-0"
            >
              View All
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {deployments.length === 0 ? (
              <div className="py-16 sm:py-20 text-center font-mono text-xs uppercase tracking-widest text-zinc-400 px-4">
                No deployments found.
              </div>
            ) : (
              deployments.map((deployment) => (
                <Link
                  href={`/projects/${deployment.project_id}`}
                  key={deployment.project_id}
                  className="group flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-5 transition hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 font-mono text-xs font-bold text-zinc-950">
                      /{deployment.name ? deployment.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-950 transition group-hover:underline truncate">
                        {deployment.name || "Untitled Deployment"}
                      </h3>
                      <p className="font-mono text-[10px] sm:text-xs text-zinc-400 mt-0.5 truncate">
                        ID: {deployment.project_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 text-right shrink-0">
                    <div className="hidden sm:block">
                      <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        PORT: {deployment.port ?? "N/A"}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                        deployment.status === "running"
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          deployment.status === "running"
                            ? "bg-white animate-pulse"
                            : "bg-zinc-400"
                        }`}
                      />
                      {deployment.status || "UNKNOWN"}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}