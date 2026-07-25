"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import AnsiText from "./AnsiText";

export interface LogLine {
  id: number;
  timestamp?: string;
  content: string;
}

interface VirtualizedLogListProps {
  logs: LogLine[];
  search: string;
  autoScroll: boolean;
  onUserScroll: () => void;
  height?: number; // Container height in px
  lineHeight?: number; // Line height in px
}

export default function VirtualizedLogList({
  logs,
  search,
  autoScroll,
  onUserScroll,
  height = 560,
  lineHeight = 24,
}: VirtualizedLogListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Filter logs if search is present
  const filteredLogs = search.trim()
    ? logs.filter((l) => l.content.toLowerCase().includes(search.toLowerCase()))
    : logs;

  const totalLines = filteredLogs.length;
  const totalHeight = totalLines * lineHeight;

  // Calculate visible index range
  const startIndex = Math.max(0, Math.floor(scrollTop / lineHeight) - 5);
  const endIndex = Math.min(
    totalLines - 1,
    Math.ceil((scrollTop + height) / lineHeight) + 5
  );

  const visibleLogs = filteredLogs.slice(startIndex, endIndex + 1);

  // Handle scroll events & detect manual user scroll up
  const handleScroll = () => {
    if (!containerRef.current) return;
    const currentScrollTop = containerRef.current.scrollTop;
    setScrollTop(currentScrollTop);

    // If user scrolls up away from bottom, notify parent to pause auto-scroll
    const isAtBottom =
      containerRef.current.scrollHeight - currentScrollTop - containerRef.current.clientHeight < 30;

    if (!isAtBottom) {
      onUserScroll();
    }
  };

  // Auto-scroll to bottom when new logs arrive and autoScroll is enabled
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs.length, autoScroll]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: `${height}px` }}
      className="overflow-y-auto bg-zinc-950 text-zinc-300 font-mono text-xs select-text focus:outline-none relative no-scrollbar"
    >
      {totalLines === 0 ? (
        <div className="py-20 text-center text-zinc-500 font-mono">
          {search ? "No log lines match your search filter." : "Waiting for log stream..."}
        </div>
      ) : (
        <div style={{ height: `${totalHeight}px`, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: `${startIndex * lineHeight}px`,
              left: 0,
              right: 0,
            }}
          >
            {visibleLogs.map((log, idx) => {
              const actualLineNumber = startIndex + idx + 1;
              return (
                <div
                  key={log.id || actualLineNumber}
                  style={{ height: `${lineHeight}px` }}
                  className="flex items-center px-4 hover:bg-zinc-900/80 transition-colors group"
                >
                  {/* Line Number */}
                  <span className="w-12 text-right pr-4 text-zinc-600 group-hover:text-zinc-400 text-[11px] font-mono select-none flex-shrink-0">
                    {actualLineNumber}
                  </span>

                  {/* Timestamp if available */}
                  {log.timestamp && (
                    <span className="text-[10px] text-zinc-500 mr-3 font-mono flex-shrink-0 hidden sm:inline">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  )}

                  {/* ANSI Colored Content */}
                  <div className="flex-1 truncate">
                    <AnsiText text={log.content} search={search} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
