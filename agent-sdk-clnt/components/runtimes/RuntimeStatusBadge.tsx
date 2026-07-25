"use client";

import { RuntimeStatus } from "@/models/agentRuntime";
import { CheckCircle2, Square, RefreshCw, AlertTriangle } from "lucide-react";

interface RuntimeStatusBadgeProps {
  status: RuntimeStatus;
  className?: string;
}

export default function RuntimeStatusBadge({
  status,
  className = "",
}: RuntimeStatusBadgeProps) {
  switch (status) {
    case "running":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/70 shadow-2xs ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Running</span>
        </span>
      );

    case "stopped":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 ${className}`}
        >
          <Square className="w-2.5 h-2.5 fill-current text-zinc-400" />
          <span>Stopped</span>
        </span>
      );

    case "restarting":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/70 ${className}`}
        >
          <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
          <span>Restarting</span>
        </span>
      );

    case "failed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/70 ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-red-500" />
          <span>Failed</span>
        </span>
      );

    default:
      return null;
  }
}
