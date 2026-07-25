"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GitCommit,
  GitBranch,
  Clock,
  ExternalLink,
  RotateCcw,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  MoreVertical,
  Terminal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IDeployment } from "@/models/deployment";
import DeploymentStatusBadge from "./DeploymentStatusBadge";
import { toast } from "sonner";

interface DeploymentCardProps {
  deployment: IDeployment;
  isLast?: boolean;
  onAction: (id: string, action: "redeploy" | "rollback" | "delete") => Promise<void>;
}

export default function DeploymentCard({
  deployment,
  isLast = false,
  onAction,
}: DeploymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const copySha = () => {
    navigator.clipboard.writeText(deployment.commitHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async (action: "redeploy" | "rollback" | "delete") => {
    if (action === "delete" && !confirm("Are you sure you want to delete this deployment record?")) {
      return;
    }

    setLoadingAction(action);
    try {
      await onAction(deployment._id as unknown as string, action);
      if (action === "rollback") {
        toast.success(`Production rolled back to commit ${deployment.commitHash}`);
      } else if (action === "redeploy") {
        toast.success(`Redeployment build triggered for ${deployment.commitHash}`);
      } else {
        toast.success("Deployment deleted");
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to execute ${action}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="relative flex gap-4">
      {/* Timeline Vertical Connector Line */}
      <div className="flex flex-col items-center">
        <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 z-10 ${
          deployment.isCurrent
            ? "border-emerald-500 bg-emerald-500"
            : deployment.status === "ready"
            ? "border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-900"
            : "border-amber-500 bg-amber-500"
        }`} />
        {!isLast && <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-800 my-1" />}
      </div>

      {/* Card Content */}
      <div className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-xs hover:shadow-md transition-all mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Badge */}
            <DeploymentStatusBadge status={deployment.status} />

            {/* Active Production Tag */}
            {deployment.isCurrent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                <Sparkles className="w-3 h-3" /> Current Production Release
              </span>
            )}

            {/* Deployment URL link */}
            {deployment.url && (
              <a
                href={deployment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {deployment.url.replace("https://", "")} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Action Menu */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/dashboard/logs"
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="View Live Logs"
            >
              <Terminal className="w-4 h-4 text-indigo-500" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 p-0 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <MoreVertical className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleExecute("redeploy")}
                  disabled={!!loadingAction}
                  className="cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>Redeploy Commit</span>
                </DropdownMenuItem>

                {deployment.status === "ready" && !deployment.isCurrent && (
                  <DropdownMenuItem
                    onClick={() => handleExecute("rollback")}
                    disabled={!!loadingAction}
                    className="cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>Rollback to this</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleExecute("delete")}
                  disabled={!!loadingAction}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete Record</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Commit Message & Metadata */}
        <div className="pt-3.5 space-y-3">
          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
            {deployment.commitMessage}
          </h4>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            {/* Commit SHA */}
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono text-[11px]">
              <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
              <span>{deployment.commitHash}</span>
              <button
                onClick={copySha}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 ml-1"
                title="Copy SHA"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
              <span>{deployment.branch}</span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-1.5">
              {deployment.author?.avatarUrl ? (
                <img
                  src={deployment.author.avatarUrl}
                  alt={deployment.author.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
              )}
              <span>{deployment.author?.name || deployment.author?.username}</span>
            </div>

            {/* Duration */}
            {deployment.durationSeconds > 0 && (
              <div className="flex items-center gap-1 font-mono text-[11px] ml-auto">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{deployment.durationSeconds}s</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
