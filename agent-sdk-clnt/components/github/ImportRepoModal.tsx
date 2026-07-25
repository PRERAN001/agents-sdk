"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Globe, Rocket, Folder, GitBranch, Terminal, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import LanguageBadge from "./LanguageBadge";

export interface RepoToImport {
  _id?: string;
  githubId: number;
  installationId: number;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  private: boolean;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  owner: {
    login: string;
    type: "User" | "Organization";
    avatarUrl?: string;
  };
}

interface ImportRepoModalProps {
  repo: RepoToImport | null;
  isOpen: boolean;
  onClose: () => void;
}

const FRAMEWORK_PRESETS = [
  { id: "python-fastapi", name: "Python 3.12 / FastAPI (DeployGent SDK)", icon: "🐍" },
];

export default function ImportRepoModal({ repo, isOpen, onClose }: ImportRepoModalProps) {
  const [projectName, setProjectName] = useState(repo ? repo.name : "");
  const [framework, setFramework] = useState("python-fastapi");
  const [rootDir, setRootDir] = useState("./");
  const [branch, setBranch] = useState(repo ? repo.defaultBranch : "main");
  const [deploying, setDeploying] = useState(false);

  if (!repo) return null;

  const handleDeploy = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a valid project name");
      return;
    }

    setDeploying(true);
    try {
      // Post to project creation API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          framework,
          rootDir,
          githubRepo: repo.fullName,
          githubBranch: branch,
          repositoryId: repo.githubId,
          repositoryFullName: repo.fullName,
          cloneUrl: repo.cloneUrl,
          installationId: repo.installationId,
          runtimeUrl: "http://localhost:8000",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to import project");
      }

      const data = await response.json();
      const projectId = data.project?._id || "1";

      toast.success(`Project "${projectName}" imported & deployed! Redirecting to agent dashboard...`);
      onClose();
      // Redirect to newly created project dashboard
      window.location.href = `/dashboard/projects/${projectId}`;
    } catch (err: any) {
      toast.error(err.message || "Failed to import repository");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-lg">
              {repo.owner.avatarUrl ? (
                <img
                  src={repo.owner.avatarUrl}
                  alt={repo.owner.login}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                repo.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Import {repo.fullName}</span>
                {repo.private ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Private
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> Public
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-1 flex items-center gap-3">
                <LanguageBadge language={repo.language} />
                <span>Default Branch: <code className="font-mono text-zinc-700 dark:text-zinc-300">{repo.defaultBranch}</code></span>
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Project Name
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-deploygent-agent"
              className="bg-white dark:bg-zinc-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Framework Preset
            </label>
            <div className="grid grid-cols-1 gap-2">
              {FRAMEWORK_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 rounded-lg border text-xs font-semibold border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-xs flex items-center gap-2.5"
                >
                  <span className="text-lg">{preset.icon}</span>
                  <span>{preset.name}</span>
                  <span className="ml-auto text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Root Directory
              </label>
              <div className="relative">
                <Folder className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                <Input
                  value={rootDir}
                  onChange={(e) => setRootDir(e.target.value)}
                  className="pl-8 bg-white dark:bg-zinc-950 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Production Branch
              </label>
              <div className="relative">
                <GitBranch className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="pl-8 bg-white dark:bg-zinc-950 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={deploying}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDeploy}
            disabled={deploying}
            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2 font-semibold"
          >
            <Rocket className="w-4 h-4" />
            <span>{deploying ? "Importing & Deploying..." : "Deploy Project"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
