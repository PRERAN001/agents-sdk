"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GitPullRequest,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import InstallGitHubAppButton from "@/components/github/InstallGitHubAppButton";
import InstallationCard, {
  InstallationData,
} from "@/components/github/InstallationCard";

function GitHubIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GitHubManagementContent() {
  const searchParams = useSearchParams();
  const [installations, setInstallations] = useState<InstallationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/github/installations");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch installations");
      }
      const data = await res.json();
      setInstallations(data.installations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load installations");
      toast.error(err.message || "Failed to load installations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();

    // Check for callback query params (success / error)
    const successMsg = searchParams.get("success");
    const errorMsg = searchParams.get("error");

    if (successMsg) {
      toast.success(successMsg);
    }
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [searchParams]);

  const handleDisconnect = (installationId: number) => {
    setInstallations((prev) =>
      prev.filter((item) => item.installationId !== installationId)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg">
              <GitHubIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              GitHub App Integration
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
            Connect DeployGent to your personal GitHub account or organizations to grant access to repositories for automated deployments, continuous integration, and smart agent actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInstallations}
            disabled={loading}
            className="p-2.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 disabled:opacity-50"
            title="Refresh Installations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <InstallGitHubAppButton size="md" variant="primary" label="Install GitHub App" />
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Multi-Organization Support
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Connect multiple GitHub organizations and user accounts seamlessly within DeployGent.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Granular Security
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Scoped installation tokens with RS256 JWT auth and HMAC SHA-256 webhook verification.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Automated Repos Sync
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Instant repository events via GitHub webhooks (`installation_repositories`).
            </p>
          </div>
        </div>
      </div>

      {/* Installations List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Connected Accounts & Organizations ({installations.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-500">Fetching GitHub App installations...</p>
          </div>
        ) : error ? (
          <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Failed to load installations</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        ) : installations.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
              <GitHubIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                No GitHub App installations found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                Connect your GitHub account or organization to enable DeployGent to deploy code and listen to commit events.
              </p>
            </div>
            <InstallGitHubAppButton size="lg" variant="primary" label="Install GitHub App Now" />
          </div>
        ) : (
          <div className="space-y-4">
            {installations.map((installation) => (
              <InstallationCard
                key={installation._id}
                installation={installation}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Security & Setup Documentation Box */}
      <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 space-y-3">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
          <Key className="w-4 h-4 text-amber-500" />
          <span>GitHub App Security Configuration</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          DeployGent operates using fine-grained GitHub App authentication. Tokens are dynamically generated per request and auto-expire after 60 minutes. Webhooks are verified using cryptographic signatures (`X-Hub-Signature-256`).
        </p>
      </div>
    </div>
  );
}

export default function GitHubManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-6 text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
        </div>
      }
    >
      <GitHubManagementContent />
    </Suspense>
  );
}
