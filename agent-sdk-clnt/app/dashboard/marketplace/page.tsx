"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Store, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import AgentMarketplaceView from "@/components/marketplace/AgentMarketplaceView";

export default function MarketplacePage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
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
              <span>Agent Marketplace & Templates</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Discover production-grade agent templates. Clone ready-to-run agents directly into your local machine with <code className="font-mono text-indigo-500">npx deploygent clone</code> or download local ZIP packages.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Local CLI Compatible</span>
        </div>
      </div>

      {/* Main Agent Marketplace View Component */}
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
            <p className="text-sm text-zinc-500 mt-2">Loading Agent Marketplace...</p>
          </div>
        }
      >
        <AgentMarketplaceView />
      </Suspense>
    </div>
  );
}
