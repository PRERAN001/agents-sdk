"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface Props {
  project: any;
  setProject: any;
}

export default function DeployStep({
  project,
  setProject,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Repository</Label>

        <Input
          disabled
          value={project.repository?.name || ""}
        />
      </div>

      <div>
        <Label>Branch</Label>

        <Select
          defaultValue="main"
          onValueChange={(value) =>
            setProject({
              ...project,
              branch: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="main">main</SelectItem>
            <SelectItem value="dev">dev</SelectItem>
            <SelectItem value="staging">staging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Runtime</Label>

        <Select
          defaultValue="python"
          onValueChange={(value) =>
            setProject({
              ...project,
              runtime: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="python">
              Python 3.12
            </SelectItem>

            <SelectItem value="node">
              Node.js 22
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Environment Variables</Label>

        <div className="space-y-3 mt-3">
          <Input placeholder="OPENAI_API_KEY" />
          <Input placeholder="ANTHROPIC_API_KEY" />
        </div>
      </div>
    </div>
  );
}