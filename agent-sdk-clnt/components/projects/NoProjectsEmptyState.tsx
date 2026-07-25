"use client";

import { FolderGit2, Plus, GitBranch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NoProjectsEmptyStateProps {
  onCreateClick: () => void;
}

export default function NoProjectsEmptyState({ onCreateClick }: NoProjectsEmptyStateProps) {
  return (
    <div className="py-16 px-6 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 text-center space-y-6 max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-900 shadow-sm">
        <FolderGit2 className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          No projects deployed yet
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Create a new autonomous agent project or import a repository from GitHub to configure runtimes, secrets, and deployment pipelines.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          onClick={onCreateClick}
          className="w-full sm:w-auto gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </Button>

        <Link href="/dashboard/repositories" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <GitBranch className="w-4 h-4 text-indigo-500" />
            <span>Import from GitHub</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
