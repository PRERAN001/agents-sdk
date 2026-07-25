"use client";

import { useState } from "react";
import { Globe, ExternalLink, Copy, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EndpointCardProps {
  runtimeUrl?: string;
}

export default function EndpointCard({ runtimeUrl = "http://localhost:8000" }: EndpointCardProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(runtimeUrl);
    setCopied(true);
    toast.success("Runtime URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>Active Agent Runtime Endpoint</span>
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full font-medium">
          <ShieldCheck className="w-3 h-3" /> ONLINE
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={runtimeUrl}
          className="flex-1 font-mono text-xs p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
        />
        <Button variant="outline" size="sm" onClick={copyUrl} className="h-9 gap-1 font-mono text-xs">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>
        <a
          href={`${runtimeUrl}/health`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Test Health Check"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Available Endpoints List */}
      <div className="pt-2 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 text-xs font-mono">
        <div className="text-[11px] font-sans font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          FastAPI Server Endpoints
        </div>
        <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
          <span><code className="text-emerald-600 dark:text-emerald-400">GET</code> /health</span>
          <span className="text-[10px] text-zinc-400">Health Check Probe</span>
        </div>
        <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
          <span><code className="text-emerald-600 dark:text-emerald-400">GET</code> /metadata</span>
          <span className="text-[10px] text-zinc-400">Agent Description & Tasks</span>
        </div>
        <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
          <span><code className="text-blue-600 dark:text-blue-400">POST</code> /run</span>
          <span className="text-[10px] text-zinc-400">Execute Agent Task</span>
        </div>
      </div>
    </div>
  );
}