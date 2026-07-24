"use client";

import { GitBranch, Lock, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RepositoryCardProps {
  selected: boolean;
  onClick: () => void;
  repo: {
    id: number;
    name: string;
    description: string;
    language: string;
    private: boolean;
    updatedAt: string;
  };
}

export default function RepositoryCard({
  selected,
  onClick,
  repo,
}: RepositoryCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer p-5 transition-all hover:border-primary hover:shadow-md",
        selected && "border-primary ring-2 ring-primary"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{repo.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {repo.description || "No description"}
          </p>
        </div>

        <Badge variant={repo.private ? "secondary" : "outline"}>
          {repo.private ? (
            <>
              <Lock className="mr-1 h-3 w-3" />
              Private
            </>
          ) : (
            <>
              <Globe className="mr-1 h-3 w-3" />
              Public
            </>
          )}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{repo.language}</span>

        <span className="flex items-center gap-1">
          <GitBranch className="h-4 w-4" />
          Updated {repo.updatedAt}
        </span>
      </div>
    </Card>
  );
}