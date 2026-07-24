"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LatestDeployment() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Latest Deployment
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-3">

        <Row label="Status" value="Running" />

        <Row label="Branch" value="main" />

        <Row label="Commit" value="a8df3b2" />

        <Row label="Runtime" value="Python 3.12" />

      </CardContent>

    </Card>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">

      <span className="text-muted-foreground">
        {label}
      </span>

      <span>{value}</span>

    </div>
  );
}