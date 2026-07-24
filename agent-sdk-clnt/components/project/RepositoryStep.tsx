"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import RepositoryCard from "./RepositoryCard";

const repositories = [
  {
    id: 1,
    name: "deploygent-sdk",
    description: "Official DeployGent SDK",
    language: "Python",
    private: true,
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "pdf-summarizer",
    description: "Summarize PDFs with AI",
    language: "Python",
    private: false,
    updatedAt: "Yesterday",
  },
  {
    id: 3,
    name: "customer-support",
    description: "AI Support Agent",
    language: "Node.js",
    private: true,
    updatedAt: "3 days ago",
  },
];

interface Props {
  project: any;
  setProject: any;
}

export default function RepositoryStep({
  project,
  setProject,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4 max-h-[350px] overflow-y-auto">
        {filtered.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repo={repo}
            selected={project.repository?.id === repo.id}
            onClick={() =>
              setProject({
                ...project,
                repository: repo,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}