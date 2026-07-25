"use client";

import { Suspense } from "react";
import Link from "next/link";
import { FolderGit2, Settings, Loader2, ArrowLeft } from "lucide-react";
import RepositoryBrowser from "@/components/github/RepositoryBrowser";
import InstallGitHubAppButton from "@/components/github/InstallGitHubAppButton";

export default function RepositoriesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
              title="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
              <span>Import Git Repository</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Select a repository from your connected GitHub accounts to import and deploy instantly with DeployGent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/github"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manage Installations</span>
          </Link>
          <InstallGitHubAppButton size="sm" variant="primary" label="Add Account" />
        </div>
      </div>

      {/* Main Repository Browser Component */}
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
            <p className="text-sm text-zinc-500 mt-2">Loading repository browser...</p>
          </div>
        }
      >
        <RepositoryBrowser />
      </Suspense>
    </div>
  );
}
