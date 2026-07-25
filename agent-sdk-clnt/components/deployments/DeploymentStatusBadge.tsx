"use client";

import { DeploymentStatus } from "@/models/deployment";
import { CheckCircle2, Loader2, AlertCircle, XCircle } from "lucide-react";

interface DeploymentStatusBadgeProps {
  status: DeploymentStatus;
  className?: string;
}

export default function DeploymentStatusBadge({
  status,
  className = "",
}: DeploymentStatusBadgeProps) {
  switch (status) {
    case "ready":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/70 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Ready</span>
        </span>
      );

    case "building":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/70 ${className}`}
        >
          <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
          <span>Building</span>
        </span>
      );

    case "failed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/70 ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span>Failed</span>
        </span>
      );

    case "canceled":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 ${className}`}
        >
          <XCircle className="w-3 h-3 text-zinc-400" />
          <span>Canceled</span>
        </span>
      );

    default:
      return null;
  }
}
