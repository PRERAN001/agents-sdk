"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";
import PlaygroundContainer from "@/components/playground/PlaygroundContainer";

export default function PlaygroundPage() {
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
              <span>DeployGent SDK Playground</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Test and inspect DeployGent SDK tasks interactively with real-time streaming, auto-generated forms, and instant code exports.
          </p>
        </div>
      </div>

      {/* Main Interactive Playground */}
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
            <p className="text-sm text-zinc-500 mt-2">Loading Playground...</p>
          </div>
        }
      >
        <PlaygroundContainer />
      </Suspense>
    </div>
  );
}
