"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderGit2, GitBranch, Server, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [runtimeUrl, setRuntimeUrl] = useState("http://localhost:8000");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          githubRepo: githubRepo.trim() || "github.com/deploygent/agent-core",
          githubBranch: githubBranch.trim() || "main",
          runtimeUrl: runtimeUrl.trim() || "http://localhost:8000",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      toast.success(`Project '${name}' created successfully`);
      setName("");
      setDescription("");
      setGithubRepo("");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-500" />
            <span>Create New Agent Project</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Deploy an autonomous agent workspace with GitHub integration and runtime management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Project Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Customer Support AI Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description (Optional)
            </label>
            <Input
              type="text"
              placeholder="Short summary of what this agent does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* GitHub Repo & Branch */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                <span>GitHub Repository</span>
              </label>
              <Input
                type="text"
                placeholder="github.com/user/repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Branch
              </label>
              <Input
                type="text"
                placeholder="main"
                value={githubBranch}
                onChange={(e) => setGithubBranch(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Runtime URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-emerald-500" />
              <span>Runtime Process URL</span>
            </label>
            <Input
              type="text"
              placeholder="http://localhost:8000"
              value={runtimeUrl}
              onChange={(e) => setRuntimeUrl(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={loading || !name.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
