"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Check, AlertCircle } from "lucide-react";

interface EnvItem {
  name: string;
  required?: boolean;
  description?: string;
}

export default function EnvironmentCard() {
  const [envs, setEnvs] = useState<EnvItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgentEnvs() {
      try {
        setLoading(true);
        const res = await fetch("/api/playground/metadata");
        if (res.ok) {
          const data = await res.json();
          const meta = data.metadata || data;
          if (meta.envs && Array.isArray(meta.envs)) {
            setEnvs(meta.envs);
          } else {
            setEnvs([]);
          }
        }
      } catch (e) {
        setEnvs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAgentEnvs();
  }, []);

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-indigo-500" />
          <span>Environment Variables</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {loading ? (
          <p className="text-xs text-zinc-400 font-mono">Inspecting required environment variables...</p>
        ) : envs.length === 0 ? (
          <div className="py-4 text-center text-xs text-zinc-500 space-y-1">
            <Check className="w-4 h-4 mx-auto text-emerald-500" />
            <p className="font-medium text-zinc-700 dark:text-zinc-300">No Required Environment Variables</p>
            <p className="text-[11px] text-zinc-400">This agent requires zero external API secrets to run.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {envs.map((env) => (
              <div key={env.name} className="flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{env.name}</span>
                  {env.description && <p className="text-[10px] text-zinc-400 font-sans">{env.description}</p>}
                </div>
                <span className="text-emerald-500 text-xs flex items-center gap-1 font-sans font-medium">
                  <Check className="w-3.5 h-3.5" /> Configured
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}