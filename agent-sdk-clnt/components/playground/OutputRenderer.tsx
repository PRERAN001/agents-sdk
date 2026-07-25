"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Code2,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutputRendererProps {
  outputType: string;
  streamingContent: string;
  isStreaming: boolean;
  rawResult: any;
  executionTimeMs?: number;
}

export default function OutputRenderer({
  outputType,
  streamingContent,
  isStreaming,
  rawResult,
  executionTimeMs,
}: OutputRendererProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Streaming Text / Markdown Output
  if (isStreaming || streamingContent) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Streaming Output</span>
            {isStreaming && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                Live SSE Stream
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(streamingContent)}
            className="h-7 text-xs gap-1.5 text-zinc-500"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Output"}</span>
          </Button>
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed min-h-[220px]">
          {streamingContent}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse align-middle" />
          )}
        </div>
      </div>
    );
  }

  // If no output yet
  if (!rawResult) {
    return (
      <div className="py-20 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/40 p-8 space-y-3">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
          <Code2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Ready for Execution
        </p>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Configure parameters on the left panel and click <strong>Run Task</strong> or press <code>⌘+Enter</code> to execute and view output.
        </p>
      </div>
    );
  }

  // 2. Structured JSON Output
  if (outputType === "json" || (typeof rawResult === "object" && rawResult !== null)) {
    const jsonString = JSON.stringify(rawResult, null, 2);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-mono">
            JSON Result ({executionTimeMs}ms)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(jsonString)}
            className="h-7 text-xs gap-1.5 text-zinc-500"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy JSON"}</span>
          </Button>
        </div>

        <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-950 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed max-h-[500px]">
          <pre>{jsonString}</pre>
        </div>
      </div>
    );
  }

  // 3. Audio Output
  if (outputType === "audio") {
    return (
      <div className="space-y-4 p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
          <Music className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            Audio Output Generated
          </h4>
          <p className="text-xs text-zinc-500 mt-1">Processed audio stream ready for playback.</p>
        </div>
        <audio controls className="w-full max-w-md mx-auto">
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // 4. Video Output
  if (outputType === "video") {
    return (
      <div className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Video className="w-4 h-4 text-rose-500" />
          <span>Processed Video Output</span>
        </div>
        <video controls className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 max-h-[360px]">
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // 5. Default Text / String Result
  const textOutput = typeof rawResult === "string" ? rawResult : JSON.stringify(rawResult, null, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-mono">
          Task Output
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(textOutput)}
          className="h-7 text-xs gap-1.5 text-zinc-500"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Text"}</span>
        </Button>
      </div>

      <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed min-h-[200px]">
        {textOutput}
      </div>
    </div>
  );
}
