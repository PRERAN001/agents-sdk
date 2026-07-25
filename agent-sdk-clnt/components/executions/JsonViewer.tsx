"use client";

import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JsonViewerProps {
  data: any;
  title?: string;
  className?: string;
}

export default function JsonViewer({ data, title, className = "" }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson =
    typeof data === "string"
      ? data
      : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            {title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 text-[11px] font-mono gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      )}

      <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-950 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed max-h-[360px]">
        <pre>{formattedJson}</pre>
      </div>
    </div>
  );
}
