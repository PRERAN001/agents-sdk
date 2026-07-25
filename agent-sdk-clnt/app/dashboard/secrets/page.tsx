"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import SecretTable from "@/components/secrets/SecretTable";

export default function SecretsPage() {
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
              <span>Environment Secrets Manager</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Production-grade encrypted storage (AES-256-GCM) for API keys, database credentials, and agent secrets with rotation and audit trails.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>AES-256-GCM Encrypted</span>
        </div>
      </div>

      {/* Main Secret Manager Table Component */}
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
            <p className="text-sm text-zinc-500 mt-2">Loading Encrypted Secrets...</p>
          </div>
        }
      >
        <SecretTable />
      </Suspense>
    </div>
  );
}
