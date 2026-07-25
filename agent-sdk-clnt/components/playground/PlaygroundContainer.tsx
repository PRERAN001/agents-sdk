"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AgentMetadata,
  TaskMetadata,
  InputMetadata,
} from "@/services/playground.service";

import ExecutionHeader from "./ExecutionHeader";
import OutputRenderer from "./OutputRenderer";
import InputField from "./InputField";

export default function PlaygroundContainer() {
  const [metadata, setMetadata] = useState<AgentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskMetadata | null>(null);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [executing, setExecuting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamChunks, setStreamChunks] = useState<string[]>([]);
  const [rawResult, setRawResult] = useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enableStreaming, setEnableStreaming] = useState(true);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setLoading(true);
        const res = await fetch("/api/playground/metadata");
        if (!res.ok) throw new Error("Failed to fetch SDK metadata");
        const data = await res.json();
        const meta = data.metadata || data;
        setMetadata(meta);

        if (meta.tasks && meta.tasks.length > 0) {
          const firstTask = meta.tasks[0];
          setSelectedTask(firstTask);
          initFormState(firstTask);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load metadata");
        toast.error("Failed to load SDK metadata");
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, []);

  const initFormState = (task: TaskMetadata) => {
    const initial: Record<string, any> = {};
    task.inputs.forEach((inp: InputMetadata) => {
      initial[inp.name] = inp.default !== undefined ? inp.default : "";
    });
    setFormState(initial);
  };

  const handleTaskChange = (task: TaskMetadata) => {
    setSelectedTask(task);
    initFormState(task);
    setStreamChunks([]);
    setRawResult(null);
    setError(null);
    setExecutionTimeMs(null);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleExecute = async () => {
    if (!selectedTask) return;

    setExecuting(true);
    setStreamChunks([]);
    setRawResult(null);
    setError(null);
    setExecutionTimeMs(null);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskName: selectedTask.name,
          inputs: formState,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to execute task");
      }

      const data = await response.json();
      setRawResult(data.result || data);
      setExecutionTimeMs(data.executionTimeMs || Date.now() - startTime);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during execution");
      toast.error(err.message || "Execution failed");
    } finally {
      setExecuting(false);
      setIsStreaming(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Loading SDK Playground...
        </p>
      </div>
    );
  }

  if (error && !metadata) {
    return (
      <div className="p-8 border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-center space-y-3">
        <AlertTriangle className="w-8 h-8 mx-auto" />
        <h3 className="font-bold text-base">Failed to load SDK Playground</h3>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  if (!metadata || !selectedTask) return null;

  return (
    <div className="space-y-6">
      <ExecutionHeader
        tasks={metadata.tasks}
        selectedTask={selectedTask}
        onSelectTask={handleTaskChange}
        streamMode={enableStreaming}
        onStreamModeChange={setEnableStreaming}
        onClearOutput={() => setRawResult(null)}
        onExportCode={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Task Inputs ({selectedTask.inputs.length})
            </h3>

            {selectedTask.inputs.map((inp) => (
              <InputField
                key={inp.name}
                input={inp}
                value={formState[inp.name]}
                onChange={(val) => handleInputChange(inp.name, val)}
              />
            ))}

            <div className="pt-2">
              <button
                onClick={handleExecute}
                disabled={executing}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {executing && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{executing ? "Executing Task..." : "Execute Agent Task"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <OutputRenderer
            outputType={(selectedTask.outputs.type as any) || "json"}
            streamingContent={streamChunks.join("")}
            isStreaming={isStreaming}
            rawResult={rawResult}
            executionTimeMs={executionTimeMs || undefined}
          />
        </div>
      </div>
    </div>
  );
}
