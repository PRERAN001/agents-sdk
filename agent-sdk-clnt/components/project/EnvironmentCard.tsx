"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const envs = [
  "OPENAI_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_KEY",
];

export default function EnvironmentCard() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Environment Variables
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-3">

        {envs.map((env) => (
          <div
            key={env}
            className="flex items-center justify-between"
          >
            <span>{env}</span>

            <span className="text-green-500">
              ✓
            </span>
          </div>
        ))}

      </CardContent>

    </Card>
  );
}