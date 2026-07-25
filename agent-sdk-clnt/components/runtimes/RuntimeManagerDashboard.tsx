"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Server,
  Activity,
  Play,
  Square,
  RefreshCw,
  Search,
  Loader2,
  HeartPulse,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { IAgentRuntime, RuntimeStatus } from "@/models/agentRuntime";
import RuntimeCard from "./RuntimeCard";
import RuntimeInfoModal from "./RuntimeInfoModal";
import { toast } from "sonner";

export default function RuntimeManagerDashboard() {
  const [runtimes, setRuntimes] = useState<IAgentRuntime[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RuntimeStatus>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Modal inspection state
  const [inspectTarget, setInspectTarget] = useState<IAgentRuntime | null>(null);

  const fetchRuntimes = useCallback(async (quiet: boolean = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await fetch("/api/runtimes");
      if (!res.ok) throw new Error("Failed to fetch runtimes");
      const data = await res.json();
      setRuntimes(data.runtimes || []);
    } catch (err: any) {
      if (!quiet) toast.error(err.message || "Failed to load agent runtimes");
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuntimes(false);
  }, [fetchRuntimes]);

  // Auto-refresh interval (every 5 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchRuntimes(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchRuntimes]);

  const handleAction = async (
    projectId: string,
    action: "start" | "stop" | "restart" | "health_check"
  ) => {
    const res = await fetch(`/api/runtimes/${projectId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `Failed to ${action} runtime`);
    }

    const data = await res.json();
    setRuntimes((prev) =>
      prev.map((r) => (r.projectId === projectId ? data.runtime : r))
    );
  };

  const handleHealthCheckAll = async () => {
    toast.info("Pinging health check endpoints for all active runtimes...");
    await Promise.all(
      runtimes.map((r) =>
        fetch(`/api/runtimes/${r.projectId}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "health_check" }),
        })
      )
    );
    fetchRuntimes(true);
    toast.success("Health checks completed");
  };

  const filteredRuntimes = runtimes.filter((r) => {
    const matchesSearch =
      r.projectName.toLowerCase().includes(search.toLowerCase()) ||
      r.projectSlug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics summary
  const runningCount = runtimes.filter((r) => r.status === "running").length;
  const stoppedCount = runtimes.filter((r) => r.status === "stopped").length;
  const failedCount = runtimes.filter((r) => r.status === "failed").length;
  const healthyCount = runtimes.filter((r) => r.health?.status === "healthy").length;

  return (
    <div className="space-y-6">
      {/* Top Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Total Agent Runtimes</span>
            <Server className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 font-mono">
            {runtimes.length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Active & Running</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {runningCount}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Healthy Status</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 font-mono">
            {healthyCount} / {runtimes.length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Failed / Errors</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2 font-mono">
            {failedCount}
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Filter runtimes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg text-xs w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                statusFilter === "all"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              All ({runtimes.length})
            </button>
            <button
              onClick={() => setStatusFilter("running")}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                statusFilter === "running"
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Running ({runningCount})
            </button>
            <button
              onClick={() => setStatusFilter("stopped")}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                statusFilter === "stopped"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Stopped ({stoppedCount})
            </button>
            <button
              onClick={() => setStatusFilter("failed")}
              className={`px-3 py-1 font-medium rounded-md transition-all ${
                statusFilter === "failed"
                  ? "bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              Failed ({failedCount})
            </button>
          </div>
        </div>

        {/* Action Controls & Auto-Refresh Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span>Auto Refresh</span>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleHealthCheckAll}
            className="h-9 text-xs gap-1.5"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Health Check All</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRuntimes(false)}
            disabled={loading}
            className="h-9 p-2.5 text-zinc-700 dark:text-zinc-300"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Runtimes Grid */}
      {loading ? (
        <div className="py-20 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500">Fetching agent runtimes & health metrics...</p>
        </div>
      ) : filteredRuntimes.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-3">
          <Server className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
            No agent runtimes found
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "No runtimes match your current filter settings."
              : "Create a project to initialize your first independent agent runtime."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRuntimes.map((runtime) => (
            <RuntimeCard
              key={runtime.runtimeId || runtime.projectId.toString()}
              runtime={runtime}
              onAction={handleAction}
              onInspect={(target) => setInspectTarget(target)}
            />
          ))}
        </div>
      )}

      {/* Info Inspection Drawer Modal */}
      <RuntimeInfoModal
        runtime={inspectTarget}
        isOpen={!!inspectTarget}
        onClose={() => setInspectTarget(null)}
      />
    </div>
  );
}
