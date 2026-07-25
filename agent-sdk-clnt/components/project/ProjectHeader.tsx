"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket, GitBranch } from "lucide-react";
import { toast } from "sonner";

interface ProjectHeaderProps {
  project?: any;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const handleRedeploy = () => {
    toast.success(`Redeployment build triggered for ${project?.name || "Agent"}! Updating runtime...`);
  };

  const name = project?.name || "DeployGent Agent Core";
  const repo = project?.githubRepo || "PRERAN001/agents-sdk";
  const branch = project?.githubBranch || "main";
  const status = project?.status || "Running";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {name}
          </h1>

          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 font-mono text-xs">
            {status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
          <span>{repo}</span>
          <span>•</span>
          <span>{branch} branch</span>
        </div>
      </div>

      <Button onClick={handleRedeploy} className="gap-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-xs">
        <Rocket className="w-4 h-4" />
        <span>Redeploy Agent</span>
      </Button>
    </div>
  );
}