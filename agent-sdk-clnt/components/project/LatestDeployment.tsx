"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, ShieldCheck } from "lucide-react";

interface LatestDeploymentProps {
  project?: any;
}

export default function LatestDeployment({ project }: LatestDeploymentProps) {
  const branch = project?.githubBranch || "main";
  const status = project?.status || "Running";
  const repo = project?.githubRepo || "PRERAN001/agents-sdk";

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Rocket className="w-4 h-4 text-indigo-500" />
          <span>Latest Agent Deployment</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 font-mono text-xs">
        <Row label="Deployment Status" value={status} isBadge />
        <Row label="Repository" value={repo} />
        <Row label="Branch" value={branch} />
        <Row label="Runtime Driver" value="Python 3.12 / FastAPI" />
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  isBadge = false,
}: {
  label: string;
  value: string;
  isBadge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500 font-sans">{label}</span>
      {isBadge ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" /> {value}
        </span>
      ) : (
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{value}</span>
      )}
    </div>
  );
}