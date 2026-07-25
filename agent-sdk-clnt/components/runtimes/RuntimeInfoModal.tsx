"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Cpu,
  HardDrive,
  Server,
  Activity,
  Copy,
  Check,
} from "lucide-react";
import { IAgentRuntime } from "@/models/agentRuntime";
import RuntimeStatusBadge from "./RuntimeStatusBadge";
import RuntimeHealthBadge from "./RuntimeHealthBadge";

interface RuntimeInfoModalProps {
  runtime: IAgentRuntime | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RuntimeInfoModal({
  runtime,
  isOpen,
  onClose,
}: RuntimeInfoModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!runtime || !isOpen) return;

    async function fetchLogs() {
      setLoadingLogs(true);
      try {
        const res = await fetch(`/api/runtimes/${runtime!.projectId}/logs`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoadingLogs(false);
      }
    }

    fetchLogs();
  }, [runtime, isOpen]);

  if (!runtime) return null;

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>{runtime.projectName} Runtime</span>
                <RuntimeStatusBadge status={runtime.status} />
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-1 flex items-center gap-3 font-mono">
                <span>ID: {runtime.runtimeId}</span>
                <span>•</span>
                <span>Port: {runtime.config?.port || runtime.metrics?.port || 8000}</span>
              </DialogDescription>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-900">
                Driver: {runtime.provider.toUpperCase()}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Details Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>CPU Usage</span>
              </div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-mono">
                {runtime.metrics?.cpuPercent || 0}%
              </p>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                <span>Memory</span>
              </div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-mono">
                {runtime.metrics?.memoryMb || 0} MB / {runtime.metrics?.maxMemoryMb || 512} MB
              </p>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                <span>PID</span>
              </div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-mono">
                {runtime.metrics?.pid || "N/A"}
              </p>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>Health Endpoint</span>
              </div>
              <div className="mt-1">
                <RuntimeHealthBadge status={runtime.health?.status || "unknown"} />
              </div>
            </div>
          </div>

          {/* Log Output Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Terminal className="w-4 h-4 text-indigo-500" /> Live Terminal Logs
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyLogs}
                className="h-7 text-xs gap-1.5 text-zinc-500"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Logs"}</span>
              </Button>
            </div>

            <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-950 rounded-xl overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed max-h-[260px] whitespace-pre-wrap">
              {logs.length === 0 ? (
                <span className="text-zinc-500">No log output recorded yet.</span>
              ) : (
                logs.map((line, idx) => (
                  <div key={idx} className="py-0.5 border-b border-zinc-900/50 last:border-none">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
