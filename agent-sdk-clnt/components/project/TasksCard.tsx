"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tasks = [
  "summarize",
  "translate",
  "chat",
  "generate_pdf",
];

export default function TasksCard() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Tasks
        </CardTitle>

      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">

        {tasks.map((task) => (
          <Badge key={task}>
            {task}
          </Badge>
        ))}

      </CardContent>

    </Card>
  );
}