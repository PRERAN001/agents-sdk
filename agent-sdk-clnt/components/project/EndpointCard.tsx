"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EndpointCard() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Public Endpoint
        </CardTitle>

      </CardHeader>

      <CardContent>

        https://sdk.deploygent.app

      </CardContent>

    </Card>
  );
}