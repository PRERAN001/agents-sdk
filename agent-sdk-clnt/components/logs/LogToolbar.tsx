"use client";

import { useState } from "react";
import {
  Search,
  Pause,
  Play,
  Download,
  Trash2,
  Terminal,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface LogToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  matchCount: number;
  autoScroll: boolean;
  onAutoScrollChange: (enabled: boolean) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isStreaming: boolean;
  onDownload: () => void;
  onClear: () => void;
  totalLines: number;
}

export default function LogToolbar({
  search,
  onSearchChange,
  matchCount,
  autoScroll,
  onAutoScrollChange,
  isPaused,
  onTogglePause,
  isStreaming,
  onDownload,
  onClear,
  totalLines,
}: LogToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 border-b border-zinc-800 bg-zinc-950 text-xs">
      {/* Search Input with Match Count */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-1">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Filter logs by keyword or regex..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-16 h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-500 font-mono"
          />
          {search && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
              {matchCount} {matchCount === 1 ? "match" : "matches"}
            </span>
          )}
        </div>

        <span className="hidden lg:inline-flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>{totalLines.toLocaleString()} lines</span>
        </span>
      </div>

      {/* Action Controls & Auto-scroll Toggle */}
      <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
        {/* Status Indicator */}
        {isStreaming ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/70 text-emerald-400 border border-emerald-900/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isPaused ? "Paused" : "Live SSE"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
            <span>Stream Complete</span>
          </span>
        )}

        {/* Auto Scroll Toggle */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900">
          <span className="text-zinc-400 font-medium">Auto-scroll</span>
          <Switch checked={autoScroll} onCheckedChange={onAutoScrollChange} />
        </div>

        {/* Pause/Resume Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePause}
          className="h-8 text-xs bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200 gap-1.5"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Pause</span>
            </>
          )}
        </Button>

        {/* Download Logs */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="h-8 text-xs bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200 gap-1.5"
          title="Download log file"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        {/* Clear Logs */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          title="Clear screen"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
