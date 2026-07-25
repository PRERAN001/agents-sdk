"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GitBranch, Terminal, Server, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GitBuildSettingsProps {
  settings: any;
  onUpdate: (updated: any) => Promise<void>;
}

export default function GitBuildSettings({ settings, onUpdate }: GitBuildSettingsProps) {
  const [githubRepo, setGithubRepo] = useState(settings?.githubRepo || "PRERAN001/agents-sdk");
  const [branch, setBranch] = useState(settings?.githubBranch || "main");
  const [buildCommand, setBuildCommand] = useState(
    settings?.buildCommand || "pip install -e . && python -m agent build"
  );
  const [outputDir, setOutputDir] = useState(settings?.outputDirectory || "./dist");
  const [runtimeEnv, setRuntimeEnv] = useState(settings?.runtimeEnv || "Python 3.12 (Process Driver)");
  const [autoDeploy, setAutoDeploy] = useState(settings?.autoDeployOnPush ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({
        ...settings,
        githubRepo,
        githubBranch: branch,
        buildCommand,
        outputDirectory: outputDir,
        runtimeEnv,
        autoDeployOnPush: autoDeploy,
      });
      toast.success("Git & Build settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Git Repository Settings */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-500" />
          <span>Connected GitHub Repository</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Repository Name
            </label>
            <Input
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Production Branch
            </label>
            <Input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950">
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Automatic Deployments on Git Push
            </p>
            <p className="text-[11px] text-zinc-500">
              Automatically trigger new build & release pipeline when changes are pushed to branch <code className="font-mono text-indigo-400">{branch}</code>.
            </p>
          </div>
          <Switch checked={autoDeploy} onCheckedChange={setAutoDeploy} />
        </div>
      </div>

      {/* Build & Runtime Settings */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span>Build & Development Settings</span>
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Build Command
          </label>
          <Input
            value={buildCommand}
            onChange={(e) => setBuildCommand(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Output Directory
            </label>
            <Input
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Runtime Driver
            </label>
            <select
              value={runtimeEnv}
              onChange={(e) => setRuntimeEnv(e.target.value)}
              className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs px-2.5 text-zinc-900 dark:text-zinc-100 font-mono"
            >
              <option value="Python 3.12 (Process Driver)">Python 3.12 (Process Driver)</option>
              <option value="Node.js 22 (Process Driver)">Node.js 22 (Process Driver)</option>
              <option value="Docker Container (deploygent-core)">Docker Container (deploygent-core)</option>
              <option value="Kubernetes Pod Driver">Kubernetes Pod Driver</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 font-semibold">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
