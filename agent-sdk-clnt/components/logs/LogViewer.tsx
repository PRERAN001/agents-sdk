"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import LogToolbar from "./LogToolbar";
import VirtualizedLogList, { LogLine } from "./VirtualizedLogList";
import { toast } from "sonner";

export default function LogViewer() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Connect to SSE log stream on mount
  useEffect(() => {
    const es = new EventSource("/api/logs/stream");
    eventSourceRef.current = es;

    let lineCounter = 1;

    es.onmessage = (event) => {
      if (isPaused) return;

      try {
        const data = JSON.parse(event.data);
        const newLine: LogLine = {
          id: lineCounter++,
          timestamp: data.timestamp,
          content: data.log,
        };
        setLogs((prev) => [...prev, newLine]);
      } catch (err) {
        console.error("Failed to parse log SSE payload:", err);
      }
    };

    es.onerror = () => {
      setIsStreaming(false);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [isPaused]);

  // Download log lines as .log file
  const handleDownload = () => {
    if (logs.length === 0) {
      toast.error("No logs to export.");
      return;
    }

    const logText = logs
      .map((l) => `${l.timestamp ? `[${l.timestamp}] ` : ""}${l.content}`)
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deploygent-execution-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported log file successfully");
  };

  const handleClear = () => {
    setLogs([]);
    toast.info("Log console cleared");
  };

  // Count search match lines
  const matchCount = search.trim()
    ? logs.filter((l) => l.content.toLowerCase().includes(search.toLowerCase())).length
    : 0;

  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden font-mono">
      {/* Control Toolbar */}
      <LogToolbar
        search={search}
        onSearchChange={setSearch}
        matchCount={matchCount}
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        isStreaming={isStreaming}
        onDownload={handleDownload}
        onClear={handleClear}
        totalLines={logs.length}
      />

      {/* Virtualized Log Container */}
      <VirtualizedLogList
        logs={logs}
        search={search}
        autoScroll={autoScroll}
        onUserScroll={() => {
          if (autoScroll) setAutoScroll(false);
        }}
        height={600}
      />
    </div>
  );
}
