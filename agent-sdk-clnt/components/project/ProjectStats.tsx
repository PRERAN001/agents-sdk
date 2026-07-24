"use client";

import StatCard from "@/components/dashboard/StatCard";
import {
  Rocket,
  Activity,
  Server,
  Gauge,
} from "lucide-react";

export default function ProjectStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

     <StatCard
  title="Deployments"
  value="14"
  icon={Rocket}
/>

<StatCard
  title="Executions"
  value="421"
  icon={Activity}
/>

<StatCard
  title="API Calls"
  value="25.4K"
  icon={Server}
/>

<StatCard
  title="Uptime"
  value="99.99%"
  icon={Gauge}
/>

    </div>
  );
}