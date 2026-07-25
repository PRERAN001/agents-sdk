"use client";

import { HealthStatus } from "@/models/agentRuntime";
import { HeartPulse, Check, AlertOctagon, Loader2, HelpCircle } from "lucide-react";

interface RuntimeHealthBadgeProps {
  status: HealthStatus;
  className?: string;
}

export default function RuntimeHealthBadge({
  status,
  className = "",
}: RuntimeHealthBadgeProps) {
  switch (status) {
    case "healthy":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 ${className}`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Healthy</span>
        </span>
      );

    case "unhealthy":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 ${className}`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Unhealthy</span>
        </span>
      );

    case "checking":
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 ${className}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Checking...</span>
        </span>
      );

    case "unknown":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] text-zinc-400 ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Unknown</span>
        </span>
      );
  }
}
