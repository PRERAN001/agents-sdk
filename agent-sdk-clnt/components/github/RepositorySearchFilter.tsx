"use client";

import { useEffect, useRef } from "react";
import { Search, Filter, SlidersHorizontal, Building2, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface AccountFilterOption {
  installationId?: number;
  login: string;
  type: "All" | "User" | "Organization";
  avatarUrl?: string;
}

interface RepositorySearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedInstallationId?: number;
  onInstallationChange: (installationId?: number) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  sortBy: "pushedAt" | "name" | "stars";
  onSortChange: (sort: "pushedAt" | "name" | "stars") => void;
  installations: AccountFilterOption[];
  languages: string[];
}

export default function RepositorySearchFilter({
  search,
  onSearchChange,
  selectedInstallationId,
  onInstallationChange,
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
  installations,
  languages,
}: RepositorySearchFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' or '⌘K' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.metaKey && e.key === "k")) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Bar: Search Input & Dropdowns */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Bar with Shortcut */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-12 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm shadow-xs focus:ring-zinc-500"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 select-none rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
            /
          </kbd>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="h-10 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-500 shadow-xs cursor-pointer w-full sm:w-auto"
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Sort By Selector */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "pushedAt" | "name" | "stars")}
            className="h-10 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-500 shadow-xs cursor-pointer w-full sm:w-auto"
          >
            <option value="pushedAt">Recently Pushed</option>
            <option value="name">Name (A-Z)</option>
            <option value="stars">Most Stars</option>
          </select>
        </div>
      </div>

      {/* Account / Installation Tabs */}
      {installations.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => onInstallationChange(undefined)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedInstallationId === undefined
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Connected Accounts</span>
          </button>

          {installations.map((inst) => {
            const isSelected = selectedInstallationId === inst.installationId;
            const isOrg = inst.type === "Organization";

            return (
              <button
                key={inst.installationId || inst.login}
                onClick={() => onInstallationChange(inst.installationId)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {inst.avatarUrl ? (
                  <img
                    src={inst.avatarUrl}
                    alt={inst.login}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                ) : isOrg ? (
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{inst.login}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
