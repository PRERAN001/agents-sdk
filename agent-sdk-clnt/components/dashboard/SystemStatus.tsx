import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { name: "API", status: "Operational" },
  { name: "Deployments", status: "Operational" },
  { name: "GitHub", status: "Operational" },
  { name: "Runtime", status: "Operational" },
];

export default function SystemStatus() {
  return (
    <Card>

      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {services.map((service) => (

          <div
            key={service.name}
            className="flex items-center justify-between"
          >

            <span>{service.name}</span>

            <div className="flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-sm text-muted-foreground">
                {service.status}
              </span>

            </div>

          </div>

        ))}

      </CardContent>

    </Card>
  );
}