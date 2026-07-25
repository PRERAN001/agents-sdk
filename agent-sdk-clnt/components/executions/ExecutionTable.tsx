"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Code2,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Server,
  Loader2,
  ExternalLink,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IExecution } from "@/models/execution";
import ExecutionStatusBadge from "./ExecutionStatusBadge";
import ExecutionSearchFilter from "./ExecutionSearchFilter";
import ExecutionDetailModal from "./ExecutionDetailModal";
import { toast } from "sonner";

export default function ExecutionTable() {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal inspection state
  const [inspectTarget, setInspectTarget] = useState<IExecution | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchExecutions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
        search: debouncedSearch,
        status: statusFilter,
      });

      const res = await fetch(`/api/executions?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch executions");
      }

      const data = await res.json();
      setExecutions(data.data || []);
      setTotalPages(data.pagination.totalPages || 1);
      setTotal(data.pagination.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load execution logs");
      toast.error(err.message || "Failed to load execution logs");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  const handleCopyResponse = (execution: IExecution, e: React.MouseEvent) => {
    e.stopPropagation();
    const text =
      typeof execution.outputs === "string"
        ? execution.outputs
        : JSON.stringify(execution.outputs, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(execution.executionId);
    toast.success("Response copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetry = async (executionId: string) => {
    const res = await fetch(`/api/executions/${executionId}/retry`, {
      method: "POST",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to retry execution");
    }

    fetchExecutions();
  };

  return (
    <div className="space-y-6">
      {/* Search & Status Filters */}
      <ExecutionSearchFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        total={total}
      />

      {/* Main Table */}
      {loading ? (
        <div className="py-20 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500">Fetching execution logs...</p>
        </div>
      ) : error ? (
        <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-center space-y-3">
          <p className="font-semibold text-sm">Failed to load executions</p>
          <p className="text-xs">{error}</p>
          <button
            onClick={fetchExecutions}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : executions.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-3">
          <Code2 className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
            No execution logs found
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "No execution logs match your active search or status filter."
              : "Execute a task in the SDK Playground to log your first execution."}
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-500 uppercase tracking-wider font-semibold font-mono">
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-4">Execution ID</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {executions.map((exec) => (
                  <tr
                    key={exec.executionId}
                    onClick={() => setInspectTarget(exec)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Task Name */}
                    <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {exec.task}
                    </td>

                    {/* Execution ID */}
                    <td className="py-3.5 px-4 font-mono text-zinc-500 dark:text-zinc-400">
                      {exec.executionId}
                    </td>

                    {/* Runtime */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        <Server className="w-2.5 h-2.5 text-indigo-500" />
                        {exec.runtime}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                      {exec.durationMs}ms
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <ExecutionStatusBadge status={exec.status} />
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                      {new Date(exec.createdAt).toLocaleTimeString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleCopyResponse(exec, e)}
                          className="h-7 px-2 text-[11px] gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                          title="Copy Response JSON"
                        >
                          {copiedId === exec.executionId ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="hidden sm:inline">Copy</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await handleRetry(exec.executionId);
                              toast.success(`Task '${exec.task}' retried successfully`);
                            } catch (err: any) {
                              toast.error(err.message || "Failed to retry execution");
                            }
                          }}
                          className="h-7 px-2 text-[11px] gap-1"
                          title="Retry Task"
                        >
                          <RotateCcw className="w-3 h-3 text-indigo-500" />
                          <span>Retry</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal Drawer */}
      <ExecutionDetailModal
        execution={inspectTarget}
        isOpen={!!inspectTarget}
        onClose={() => setInspectTarget(null)}
        onRetry={handleRetry}
      />
    </div>
  );
}
