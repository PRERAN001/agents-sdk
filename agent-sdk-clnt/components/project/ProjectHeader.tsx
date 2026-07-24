"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProjectHeader() {
  return (
    <div className="flex items-start justify-between">

      <div className="space-y-3">

        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold">
              DeployGent SDK
            </h1>

            <Badge>
              Running
            </Badge>

          </div>

          <div className="mt-2 flex items-center gap-2 text-muted-foreground">

            

            github.com/preran/deploygent-sdk

          </div>

        </div>

      </div>

      <Button>
        Redeploy
      </Button>

    </div>
  );
}