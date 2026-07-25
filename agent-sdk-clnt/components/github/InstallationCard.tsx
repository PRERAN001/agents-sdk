"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  User,
  RefreshCw,
  Trash2,
  Lock,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export interface AccountData {
  id: number;
  login: string;
  type: "User" | "Organization";
  avatarUrl: string;
  htmlUrl: string;
}

export interface RepositoryData {
  _id?: string;
  githubId: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  defaultBranch: string;
}

export interface InstallationData {
  _id: string;
  installationId: number;
  account: AccountData;
  repositorySelection: "all" | "selected";
  status: "active" | "suspended" | "deleted";
  updatedAt: string;
}

interface InstallationCardProps {
  installation: InstallationData;
  onDisconnect?: (installationId: number) => void;
}

export default function InstallationCard({
  installation,
  onDisconnect,
}: InstallationCardProps) {
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchRepositories = async (refresh: boolean = false) => {
    if (refresh) setSyncing(true);
    else setLoadingRepos(true);

    try {
      const res = await fetch(
        `/api/github/repositories?installationId=${installation.installationId}${
          refresh ? "&refresh=true" : ""
        }`
      );

      if (!res.ok) throw new Error("Failed to load repositories");

      const data = await res.json();
      setRepositories(data.repositories || []);
      if (refresh) {
        toast.success("Repository list synchronized with GitHub");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sync repositories");
    } finally {
      setLoadingRepos(false);
      setSyncing(false);
    }
  };

  const toggleExpand = () => {
    if (!expanded && repositories.length === 0) {
      fetchRepositories(false);
    }
    setExpanded(!expanded);
  };

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect ${installation.account.login}?`)) {
      return;
    }

    setDisconnecting(true);
    try {
      const res = await fetch(
        `/api/github/installations?installationId=${installation.installationId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to disconnect installation");
      }

      toast.success(`Disconnected ${installation.account.login}`);
      if (onDisconnect) {
        onDisconnect(installation.installationId);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect");
    } finally {
      setDisconnecting(false);
    }
  };

  const isOrg = installation.account.type === "Organization";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden transition-all">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Account Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 flex-shrink-0">
            {installation.account.avatarUrl ? (
              <img
                src={installation.account.avatarUrl}
                alt={installation.account.login}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                {isOrg ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                {installation.account.login}
              </h3>

              {/* Account Type Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                {isOrg ? (
                  <>
                    <Building2 className="w-3 h-3 text-indigo-500" /> Organization
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-emerald-500" /> User
                  </>
                )}
              </span>

              {/* Status Badge */}
              {installation.status === "active" ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> {installation.status}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Access:{" "}
              <span className="capitalize font-medium text-zinc-700 dark:text-zinc-300">
                {installation.repositorySelection === "all"
                  ? "All repositories"
                  : "Selected repositories only"}
              </span>
              {" • "}
              ID: {installation.installationId}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => fetchRepositories(true)}
            disabled={syncing}
            title="Sync repositories from GitHub"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          </button>

          <a
            href={installation.account.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            title="Disconnect installation"
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
          >
            {disconnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={toggleExpand}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors ml-1"
          >
            <span>Repos</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Repositories Drawer */}
      {expanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Accessible Repositories {repositories.length > 0 && `(${repositories.length})`}
            </h4>
            <a
              href={`https://github.com/settings/installations/${installation.installationId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Configure permissions on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {loadingRepos ? (
            <div className="py-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading repositories...
            </div>
          ) : repositories.length === 0 ? (
            <div className="py-6 text-center text-sm text-zinc-500">
              No repositories synced yet. Click sync button above to fetch repositories.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {repositories.map((repo) => (
                <div
                  key={repo.githubId}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {repo.private ? (
                      <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    )}
                    <span className="truncate font-sans font-medium text-zinc-800 dark:text-zinc-200">
                      {repo.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-sans">
                    {repo.defaultBranch}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
