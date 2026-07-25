"use client";

import { useState, useEffect } from "react";
import { PlayCircle, CheckCircle2, AlertCircle, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TaskInputDef {
  name: string;
  type: string;
  label: string;
  required?: boolean;
}

interface TaskDef {
  name: string;
  inputs: TaskInputDef[];
  outputs?: any;
}

interface AgentMetadata {
  name: string;
  version: string;
  tasks: TaskDef[];
  envs?: any[];
}

interface TasksCardProps {
  runtimeUrl?: string;
}

export default function TasksCard({ runtimeUrl }: TasksCardProps) {
  const [metadata, setMetadata] = useState<AgentMetadata | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch Agent Metadata from target project's runtime URL
  const fetchMetadata = async () => {
    try {
      setLoadingMeta(true);
      const targetQuery = runtimeUrl ? `?url=${encodeURIComponent(runtimeUrl)}` : "";
      const res = await fetch(`/api/playground/metadata${targetQuery}`);
      if (res.ok) {
        const data = await res.json();
        const meta = data.metadata || data;
        setMetadata(meta);
        if (meta.tasks && meta.tasks.length > 0) {
          setSelectedTask(meta.tasks[0].name);
          const initial: Record<string, string> = {};
          meta.tasks[0].inputs.forEach((inp: TaskInputDef) => {
            initial[inp.name] = "";
          });
          setInputValues(initial);
        }
      }
    } catch (e) {
      console.error("Failed to load agent metadata:", e);
    } finally {
      setLoadingMeta(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, [runtimeUrl]);

  const handleTaskSelect = (taskName: string) => {
    setSelectedTask(taskName);
    setExecutionResult(null);
    setExecutionError(null);

    const taskObj = metadata?.tasks.find((t) => t.name === taskName);
    if (taskObj) {
      const initial: Record<string, string> = {};
      taskObj.inputs.forEach((inp) => {
        initial[inp.name] = inputValues[inp.name] || "";
      });
      setInputValues(initial);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleExecute = async () => {
    if (!selectedTask) return;

    setExecuting(true);
    setExecutionResult(null);
    setExecutionError(null);

    try {
      const response = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: selectedTask,
          inputs: inputValues,
          runtimeUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || data.detail || "Task execution failed");
      }

      setExecutionResult(data);
      toast.success(`Task "${selectedTask}" executed successfully!`);
    } catch (err: any) {
      setExecutionError(err.message || "Failed to execute agent task");
      toast.error(err.message || "Execution error");
    } finally {
      setExecuting(false);
    }
  };

  const currentTaskObj = metadata?.tasks.find((t) => t.name === selectedTask);

  const copyResult = () => {
    if (executionResult) {
      navigator.clipboard.writeText(JSON.stringify(executionResult, null, 2));
      setCopied(true);
      toast.success("Execution output copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Agent Tasks & Live Execution</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Auto-discovered tasks from <code className="font-mono text-indigo-400">loader.py</code> / <code className="font-mono text-indigo-400">agent.describe()</code> running on endpoint.
          </p>
        </div>
        {metadata && (
          <Badge variant="outline" className="font-mono text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900">
            {metadata.name} v{metadata.version}
          </Badge>
        )}
      </div>

      {loadingMeta ? (
        <div className="py-10 text-center text-xs text-zinc-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-zinc-400 mb-2" />
          <span>Inspecting agent tasks from runtime endpoint...</span>
        </div>
      ) : !metadata || metadata.tasks.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500 space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto text-zinc-400" />
          <p>No tasks discovered in agent runtime. Make sure your <code className="font-mono">agent.py</code> registers tasks using <code className="font-mono">@agent.task</code>.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Task Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Select Agent Task
            </label>
            <div className="flex flex-wrap gap-2">
              {metadata.tasks.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleTaskSelect(t.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                    selectedTask === t.name
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Input Fields */}
          {currentTaskObj && (
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Task Inputs for <code className="font-mono text-indigo-500">{currentTaskObj.name}</code>
              </h4>

              {currentTaskObj.inputs.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">This task takes no parameters.</p>
              ) : (
                <div className="space-y-3">
                  {currentTaskObj.inputs.map((inp) => (
                    <div key={inp.name} className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                        <span>{inp.label || inp.name}</span>
                        <span className="font-mono text-[10px] text-zinc-400 uppercase">{inp.type}</span>
                      </label>
                      {inp.type === "textarea" || inp.name.includes("document") || inp.name.includes("prompt") || inp.name.includes("code") ? (
                        <textarea
                          rows={3}
                          value={inputValues[inp.name] || ""}
                          onChange={(e) => handleInputChange(inp.name, e.target.value)}
                          placeholder={`Enter ${inp.name}...`}
                          className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      ) : (
                        <Input
                          value={inputValues[inp.name] || ""}
                          onChange={(e) => handleInputChange(inp.name, e.target.value)}
                          placeholder={`Enter ${inp.name}...`}
                          className="font-mono text-xs bg-white dark:bg-zinc-950"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Execute Button */}
              <div className="pt-2">
                <Button
                  onClick={handleExecute}
                  disabled={executing}
                  className="w-full sm:w-auto bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2 font-semibold text-xs cursor-pointer"
                >
                  {executing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{executing ? "Executing Task..." : "Execute Agent Task"}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Execution Result / Error Display */}
          {executionError && (
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-xs text-red-600 dark:text-red-400 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Execution Error
              </p>
              <pre className="font-mono text-[11px] whitespace-pre-wrap">{executionError}</pre>
            </div>
          )}

          {executionResult && (
            <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Output Response
                </span>
                <Button variant="ghost" size="sm" onClick={copyResult} className="h-7 text-xs font-mono gap-1 text-emerald-700 dark:text-emerald-400">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Output"}</span>
                </Button>
              </div>

              <pre className="p-3 rounded-md bg-zinc-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}