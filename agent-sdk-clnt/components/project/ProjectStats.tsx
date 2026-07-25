"use client";

import StatCard from "@/components/dashboard/StatCard";
import { Rocket, Activity, Server, ShieldCheck } from "lucide-react";

interface ProjectStatsProps {
  deploymentCount?: number;
  executionCount?: number;
  status?: string;
}

export default function ProjectStats({
  deploymentCount = 1,
  executionCount = 0,
  status = "Running",
}: ProjectStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Deployments"
        value={deploymentCount.toString()}
        icon={Rocket}
      />

      <StatCard
        title="Live Executions"
        value={executionCount.toString()}
        icon={Activity}
      />

      <StatCard
        title="API Server Status"
        value={status}
        icon={Server}
      />

      <StatCard
        title="Health Check"
        value="100%"
        icon={ShieldCheck}
      />
    </div>
  );
}