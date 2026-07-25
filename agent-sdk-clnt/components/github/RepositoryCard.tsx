"use client";

import { Lock, Globe, ExternalLink, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageBadge from "./LanguageBadge";
import { RepoToImport } from "./ImportRepoModal";

interface RepositoryCardProps {
  repo: RepoToImport & {
    pushedAt?: string | Date;
    stargazersCount?: number;
  };
  onImport: (repo: RepoToImport) => void;
}

/**
 * Utility to format timestamp into human-readable relative time (e.g. "Pushed 5 mins ago").
 */
function formatRelativeTime(dateInput?: string | Date): string {
  if (!dateInput) return "No recent commits";

  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return "Just now";

  if (seconds < 60) return "Pushed just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Pushed ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Pushed ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Pushed ${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Pushed ${months}mo ago`;
  const years = Math.floor(months / 12);
  return `Pushed ${years}y ago`;
}

export default function RepositoryCard({ repo, onImport }: RepositoryCardProps) {
  const isOrg = repo.owner.type === "Organization";

  return (
    <div className="group relative border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/90 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        {/* Top Header: Owner Avatar & Title + Badges */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs">
              {repo.owner.avatarUrl ? (
                <img
                  src={repo.owner.avatarUrl}
                  alt={repo.owner.login}
                  className="w-full h-full object-cover"
                />
              ) : (
                repo.owner.login.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:underline truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                >
                  {repo.fullName}
                </a>
                <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Visibility Badge */}
          {repo.private ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 flex-shrink-0">
              <Lock className="w-3 h-3" /> Private
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
              <Globe className="w-3 h-3" /> Public
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[32px] mb-4">
          {repo.description || "No description provided."}
        </p>
      </div>

      {/* Footer Info & Import Button */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
          <LanguageBadge language={repo.language} />
          
          <span className="text-[11px] text-zinc-400 font-mono">
            {formatRelativeTime(repo.pushedAt)}
          </span>

          {(repo.stargazersCount ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {repo.stargazersCount}
            </span>
          )}
        </div>

        {/* Vercel-style Import Button */}
        <Button
          size="sm"
          onClick={() => onImport(repo)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold px-3 py-1.5 h-8 rounded-lg shadow-sm gap-1 transition-all group-hover:translate-x-0.5"
        >
          <span>Import</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
