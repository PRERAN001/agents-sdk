"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeploymentSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  total: number;
}

export default function DeploymentSearchFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  page,
  totalPages,
  onPageChange,
  total,
}: DeploymentSearchFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search commit, branch, or author..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg text-xs w-full sm:w-auto">
          <button
            onClick={() => onStatusChange("all")}
            className={`px-3 py-1 font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onStatusChange("ready")}
            className={`px-3 py-1 font-medium rounded-md transition-all ${
              statusFilter === "ready"
                ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => onStatusChange("building")}
            className={`px-3 py-1 font-medium rounded-md transition-all ${
              statusFilter === "building"
                ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Building
          </button>
          <button
            onClick={() => onStatusChange("failed")}
            className={`px-3 py-1 font-medium rounded-md transition-all ${
              statusFilter === "failed"
                ? "bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <span>
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total deployments)
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-8 text-xs gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
