"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, GitCommit, RefreshCw } from "lucide-react";
import { IDeployment } from "@/models/deployment";
import DeploymentCard from "./DeploymentCard";
import DeploymentSearchFilter from "./DeploymentSearchFilter";
import { toast } from "sonner";

export default function DeploymentHistoryView() {
  const [deployments, setDeployments] = useState<IDeployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDeployments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
        search: debouncedSearch,
        status: statusFilter,
      });

      const res = await fetch(`/api/deployments?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch deployments");
      }

      const data = await res.json();
      setDeployments(data.data || []);
      setTotalPages(data.pagination.totalPages || 1);
      setTotal(data.pagination.total || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching deployments");
      toast.error(err.message || "Failed to load deployment history");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  const handleAction = async (id: string, action: "redeploy" | "rollback" | "delete") => {
    const res = await fetch(`/api/deployments/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || `Failed to execute ${action}`);
    }

    fetchDeployments();
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <DeploymentSearchFilter
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

      {/* Main Timeline View */}
      {loading ? (
        <div className="py-20 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500">Fetching deployment timeline...</p>
        </div>
      ) : error ? (
        <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-center space-y-3">
          <p className="font-semibold text-sm">Failed to load deployment history</p>
          <p className="text-xs">{error}</p>
          <button
            onClick={fetchDeployments}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : deployments.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-3">
          <GitCommit className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
            No deployments found
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "No deployments match your active search or status filter."
              : "No deployment history records found for this project."}
          </p>
        </div>
      ) : (
        <div className="pt-2">
          {deployments.map((deployment, idx) => (
            <DeploymentCard
              key={(deployment._id as unknown as string) || idx.toString()}
              deployment={deployment}
              isLast={idx === deployments.length - 1}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
