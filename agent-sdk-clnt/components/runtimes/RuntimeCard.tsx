"use client";

import { useState } from "react";
import {
  Play,
  Square,
  RotateCw,
  HeartPulse,
  Terminal,
  Cpu,
  HardDrive,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IAgentRuntime } from "@/models/agentRuntime";
import RuntimeStatusBadge from "./RuntimeStatusBadge";
import RuntimeHealthBadge from "./RuntimeHealthBadge";
import { toast } from "sonner";

interface RuntimeCardProps {
  runtime: IAgentRuntime;
  onAction: (projectId: string, action: "start" | "stop" | "restart" | "health_check") => Promise<void>;
  onInspect: (runtime: IAgentRuntime) => void;
}

export default function RuntimeCard({
  runtime,
  onAction,
  onInspect,
}: RuntimeCardProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleExecute = async (action: "start" | "stop" | "restart" | "health_check") => {
    setLoadingAction(action);
    try {
      await onAction(runtime.projectId as string, action);
      toast.success(
        `Runtime ${action === "health_check" ? "health checked" : action + "ed"} successfully`
      );
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} runtime`);
    } fontFinally: {
      setLoadingAction(null);
    }
  };

  const isRunning = runtime.status === "running";
  const memoryPercent = Math.min(
    100,
    Math.round(((runtime.metrics?.memoryMb || 0) / (runtime.metrics?.maxMemoryMb || 512)) * 100)
  );

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">
              {runtime.projectName}
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Port: {runtime.config?.port || runtime.metrics?.port || 8000} • PID: {runtime.metrics?.pid || "N/A"}
            </p>
          </div>

          <RuntimeStatusBadge status={runtime.status} />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <span className="text-zinc-500 font-medium">Health Status:</span>
          <RuntimeHealthBadge status={runtime.health?.status || "unknown"} />
        </div>
      </div>

      {/* Metrics Gauges */}
      <div className="space-y-2.5">
        {/* CPU Meter */}
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" /> CPU
            </span>
            <span className="font-mono text-zinc-700 dark:text-zinc-300">
              {runtime.metrics?.cpuPercent || 0}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (runtime.metrics?.cpuPercent || 0) * 4)}%` }}
            />
          </div>
        </div>

        {/* RAM Meter */}
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> RAM
            </span>
            <span className="font-mono text-zinc-700 dark:text-zinc-300">
              {runtime.metrics?.memoryMb || 0} MB / {runtime.metrics?.maxMemoryMb || 512} MB
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${memoryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExecute("stop")}
              disabled={!!loadingAction}
              className="h-8 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/60 gap-1"
            >
              {loadingAction === "stop" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Square className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Stop</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleExecute("start")}
              disabled={!!loadingAction}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            >
              {loadingAction === "start" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Start</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExecute("restart")}
            disabled={!!loadingAction}
            className="h-8 text-xs text-zinc-700 dark:text-zinc-300 gap-1"
            title="Restart runtime"
          >
            {loadingAction === "restart" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCw className="w-3.5 h-3.5" />
            )}
            <span>Restart</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExecute("health_check")}
            disabled={!!loadingAction}
            className="h-8 p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            title="Ping Health Check"
          >
            {loadingAction === "health_check" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onInspect(runtime)}
          className="h-8 text-xs gap-1"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-500" />
          <span>Logs</span>
        </Button>
      </div>
    </div>
  );
}
