"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  project: any;
  setProject: any;
}

export default function ProjectDetailsStep({
  project,
  setProject,
}: Props) {
  return (
    <div className="space-y-6">

      <div>

        <Label>Project Name</Label>

        <Input
          value={project.name}
          onChange={(e) =>
            setProject({
              ...project,
              name: e.target.value,
            })
          }
        />

      </div>

      <div>

        <Label>Description</Label>

        <Textarea
          rows={5}
          value={project.description}
          onChange={(e) =>
            setProject({
              ...project,
              description: e.target.value,
            })
          }
        />

      </div>

    </div>
  );
}