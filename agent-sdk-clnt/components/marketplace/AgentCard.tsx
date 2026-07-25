"use client";

import { Star, Download, Terminal, ArrowRight, Bot, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMarketplaceAgent } from "@/models/marketplaceAgent";

interface AgentCardProps {
  agent: IMarketplaceAgent;
  onSelect: (agent: IMarketplaceAgent) => void;
}

export default function AgentCard({ agent, onSelect }: AgentCardProps) {
  return (
    <div
      onClick={() => onSelect(agent)}
      className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
            <Bot className="w-3.5 h-3.5" />
            <span>{agent.category}</span>
          </span>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>{agent.stars}</span>
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>{agent.clones}</span>
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {agent.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {agent.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {agent.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CLI Command preview & CTA */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[200px]">
          {agent.cliCommand}
        </span>

        <Button size="sm" variant="ghost" className="h-8 text-xs font-semibold gap-1 text-indigo-600 dark:text-indigo-400">
          <span>Clone & Deploy</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
