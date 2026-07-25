"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, FolderGit2, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import RepositoryCard from "./RepositoryCard";
import RepositorySearchFilter, { AccountFilterOption } from "./RepositorySearchFilter";
import ImportRepoModal, { RepoToImport } from "./ImportRepoModal";
import InstallGitHubAppButton from "./InstallGitHubAppButton";

const COMMON_LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Ruby",
  "PHP",
  "HTML",
  "CSS",
  "Shell",
];

export default function RepositoryBrowser() {
  const [repositories, setRepositories] = useState<RepoToImport[]>([]);
  const [installations, setInstallations] = useState<AccountFilterOption[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedInstallationId, setSelectedInstallationId] = useState<number | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState<"pushedAt" | "name" | "stars">("pushedAt");

  // Import Modal state
  const [selectedRepoForImport, setSelectedRepoForImport] = useState<RepoToImport | null>(null);

  // Observer sentinel element ref for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch installations on mount
  useEffect(() => {
    async function loadInstallations() {
      try {
        const res = await fetch("/api/github/installations");
        if (!res.ok) return;
        const data = await res.json();
        const formatted: AccountFilterOption[] = (data.installations || []).map((inst: any) => ({
          installationId: inst.installationId,
          login: inst.account.login,
          type: inst.account.type,
          avatarUrl: inst.account.avatarUrl,
        }));
        setInstallations(formatted);
      } catch (err) {
        console.error("Failed to load installations for filter:", err);
      }
    }

    loadInstallations();
  }, []);

  // Fetch repositories from API endpoint
  const fetchRepositories = useCallback(
    async (targetPage: number, isInitial: boolean = false) => {
      try {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: targetPage.toString(),
          limit: "12",
          search: debouncedSearch,
          sort: sortBy,
        });

        if (selectedInstallationId !== undefined) {
          queryParams.set("installationId", selectedInstallationId.toString());
        }
        if (selectedLanguage) {
          queryParams.set("language", selectedLanguage);
        }

        const res = await fetch(`/api/github/repositories/browse?${queryParams.toString()}`);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load repositories");
        }

        const data = await res.json();

        if (isInitial || targetPage === 1) {
          setRepositories(data.data || []);
        } else {
          setRepositories((prev) => [...prev, ...(data.data || [])]);
        }

        setPage(data.pagination.page);
        setHasMore(data.pagination.hasMore);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching repositories");
      } fontFinally: {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, selectedInstallationId, selectedLanguage, sortBy]
  );

  // Trigger fetch when search or filters change
  useEffect(() => {
    fetchRepositories(1, true);
  }, [fetchRepositories]);

  // Infinite Scroll IntersectionObserver handler
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && !loadingMore) {
        fetchRepositories(page + 1, false);
      }
    },
    [hasMore, loading, loadingMore, page, fetchRepositories]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "200px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <RepositorySearchFilter
        search={search}
        onSearchChange={setSearch}
        selectedInstallationId={selectedInstallationId}
        onInstallationChange={setSelectedInstallationId}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        sortBy={sortBy}
        onSortChange={setSortBy}
        installations={installations}
        languages={COMMON_LANGUAGES}
      />

      {/* Main Grid View */}
      {loading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-4" />
                </div>
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
              <Skeleton className="w-full h-8" />
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="p-8 border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Failed to load repositories</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchRepositories(1, true)}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : repositories.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
              No repositories found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              {search || selectedLanguage || selectedInstallationId !== undefined
                ? "No repositories match your current filters. Try clearing search or changing filters."
                : "No connected GitHub repositories available. Install the DeployGent GitHub App to grant access."}
            </p>
          </div>
          {search || selectedLanguage || selectedInstallationId !== undefined ? (
            <button
              onClick={() => {
                setSearch("");
                setSelectedLanguage("");
                setSelectedInstallationId(undefined);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          ) : (
            <InstallGitHubAppButton size="md" variant="primary" />
          )}
        </div>
      ) : (
        /* Repositories Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repositories.map((repo) => (
            <RepositoryCard
              key={repo.githubId}
              repo={repo}
              onImport={(target) => setSelectedRepoForImport(target)}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader Sentinel */}
      <div ref={observerRef} className="py-4 text-center">
        {loadingMore && (
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            <span>Loading more repositories...</span>
          </div>
        )}
      </div>

      {/* Import Modal */}
      <ImportRepoModal
        repo={selectedRepoForImport}
        isOpen={!!selectedRepoForImport}
        onClose={() => setSelectedRepoForImport(null)}
      />
    </div>
  );
}
