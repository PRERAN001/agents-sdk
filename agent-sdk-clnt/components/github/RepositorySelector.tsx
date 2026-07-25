"use client";

import { useState, useEffect } from "react";
import {
  GitFork,
  Search,
  Lock,
  Globe,
  Building2,
  User,
  Loader2,
  Check,
  PlusCircle,
} from "lucide-react";
import InstallGitHubAppButton from "./InstallGitHubAppButton";

export interface RepositoryOption {
  _id?: string;
  githubId: number;
  installationId: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  owner: {
    login: string;
    type: "User" | "Organization";
    avatarUrl?: string;
  };
}

interface RepositorySelectorProps {
  selectedRepository: RepositoryOption | null;
  onSelect: (repo: RepositoryOption) => void;
  className?: string;
}

export default function RepositorySelector({
  selectedRepository,
  onSelect,
  className = "",
}: RepositorySelectorProps) {
  const [repositories, setRepositories] = useState<RepositoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadRepositories() {
      try {
        setLoading(true);
        const res = await fetch("/api/github/repositories");
        if (!res.ok) throw new Error("Failed to fetch repositories");
        const data = await res.json();
        setRepositories(data.repositories || []);
      } catch (error) {
        console.error("Error loading repositories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRepositories();
  }, []);

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.fullName.toLowerCase().includes(search.toLowerCase()) ||
      repo.owner.login.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
        GitHub Repository
      </label>

      {/* Selected Box / Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-lg cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm"
      >
        {selectedRepository ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            {selectedRepository.private ? (
              <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            ) : (
              <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {selectedRepository.fullName}
            </span>
            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {selectedRepository.defaultBranch}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <GitFork className="w-4 h-4" />
            <span>Select a repository for DeployGent project...</span>
          </div>
        )}

        <Search className="w-4 h-4 text-zinc-400" />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-50 mt-2 w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
          {/* Search Bar */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950">
            <Search className="w-4 h-4 text-zinc-400 ml-2" />
            <input
              type="text"
              placeholder="Search repositories by name or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm bg-transparent border-none focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 p-1.5"
              autoFocus
            />
          </div>

          {/* List items */}
          <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {loading ? (
              <div className="p-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading connected repositories...
              </div>
            ) : filteredRepositories.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-zinc-500 mb-3">
                  {repositories.length === 0
                    ? "No GitHub App installations found or no repositories accessible."
                    : "No matching repositories found."}
                </p>
                <InstallGitHubAppButton size="sm" variant="outline" />
              </div>
            ) : (
              filteredRepositories.map((repo) => {
                const isSelected = selectedRepository?.githubId === repo.githubId;
                const isOrg = repo.owner.type === "Organization";

                return (
                  <div
                    key={repo.githubId}
                    onClick={() => {
                      onSelect(repo);
                      setOpen(false);
                    }}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {repo.private ? (
                        <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      ) : (
                        <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{repo.fullName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                            {isOrg ? <Building2 className="w-2.5 h-2.5 text-indigo-500" /> : <User className="w-2.5 h-2.5 text-emerald-500" />}
                            {repo.owner.login}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Default branch: <code className="text-zinc-600 dark:text-zinc-300">{repo.defaultBranch}</code>
                        </p>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Need access to another organization or repo?
            </span>
            <InstallGitHubAppButton size="sm" variant="secondary" label="Add Account" />
          </div>
        </div>
      )}
    </div>
  );
}
