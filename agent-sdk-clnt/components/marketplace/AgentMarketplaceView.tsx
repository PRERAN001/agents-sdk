"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Bot, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IMarketplaceAgent } from "@/models/marketplaceAgent";
import AgentCard from "./AgentCard";
import AgentDetailModal from "./AgentDetailModal";
import { toast } from "sonner";

export default function AgentMarketplaceView() {
  const [agents, setAgents] = useState<IMarketplaceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryTab, setCategoryTab] = useState("all");

  const [selectedAgent, setSelectedAgent] = useState<IMarketplaceAgent | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: categoryTab,
        search,
      });
      const res = await fetch(`/api/marketplace?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (err) {
      toast.error("Failed to load marketplace agent templates");
    } finally {
      setLoading(false);
    }
  }, [categoryTab, search]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg text-xs w-full sm:w-auto flex-wrap">
          {["all", "DevOps", "Support", "Security", "Finance", "Research"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryTab(tab)}
              className={`px-3 py-1 font-medium capitalize rounded-md transition-all ${
                categoryTab === tab
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search templates, tags, or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          />
        </div>
      </div>

      {/* Main Agent Grid */}
      {loading ? (
        <div className="py-20 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500">Loading Agent Marketplace...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-8 space-y-3">
          <Bot className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
            No agent templates found
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            No agent templates match your search or active category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.slug}
              agent={agent}
              onSelect={setSelectedAgent}
            />
          ))}
        </div>
      )}

      {/* Agent Detail Modal */}
      <AgentDetailModal
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
