"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Clock,
  Server,
  Copy,
  Check,
  Loader2,
  Code2,
  Terminal,
} from "lucide-react";
import { IExecution } from "@/models/execution";
import ExecutionStatusBadge from "./ExecutionStatusBadge";
import JsonViewer from "./JsonViewer";
import { toast } from "sonner";

interface ExecutionDetailModalProps {
  execution: IExecution | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: (executionId: string) => Promise<void>;
}

export default function ExecutionDetailModal({
  execution,
  isOpen,
  onClose,
  onRetry,
}: ExecutionDetailModalProps) {
  const [retrying, setRetrying] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  if (!execution) return null;

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry(execution.executionId);
      toast.success("Execution retried successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to retry execution");
    } finally {
      setRetrying(false);
    }
  };

  const copyResponseText = () => {
    const text =
      typeof execution.outputs === "string"
        ? execution.outputs
        : JSON.stringify(execution.outputs, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Task: {execution.task}</span>
                <ExecutionStatusBadge status={execution.status} />
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-1 flex items-center gap-3 font-mono">
                <span>ID: {execution.executionId}</span>
                <span>•</span>
                <span>{new Date(execution.createdAt).toLocaleString()}</span>
              </DialogDescription>
            </div>

            <Button
              size="sm"
              onClick={handleRetry}
              disabled={retrying}
              className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-1.5"
            >
              {retrying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>Retry Task</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Details Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Execution Duration</span>
              </div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-mono">
                {execution.durationMs}ms
              </p>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Server className="w-3.5 h-3.5 text-emerald-500" />
                <span>Runtime Environment</span>
              </div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-mono truncate">
                {execution.runtime}
              </p>
            </div>
          </div>

          {/* Error Message if Failed */}
          {execution.errorMessage && (
            <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl text-xs font-mono">
              <p className="font-bold mb-0.5">Error Message:</p>
              <p>{execution.errorMessage}</p>
            </div>
          )}

          {/* JSON Viewers for Inputs & Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JsonViewer data={execution.inputs} title="Inputs Payload" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                  Outputs Payload
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyResponseText}
                  className="h-6 text-[11px] font-mono gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOutput ? "Copied" : "Copy Response"}</span>
                </Button>
              </div>

              <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-950 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed max-h-[360px]">
                <pre>{typeof execution.outputs === "string" ? execution.outputs : JSON.stringify(execution.outputs, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
