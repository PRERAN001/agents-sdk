import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  Plus,
  
  Rocket,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    title: "New Project",
    href: "/dashboard/projects/new",
    icon: Plus,
  },
  {
    title: "Deploy",
    href: "/dashboard/deployments",
    icon: Rocket,
  },
  {
    title: "GitHub",
    href: "/dashboard/github",
    icon: SiGithub,
  },
  {
    title: "Docs",
    href: "/docs",
    icon: BookOpen,
  },
];

export default function QuickActions() {
  return (
    <Card>

      <CardContent className="grid grid-cols-2 gap-3 p-6">

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              asChild
              variant="outline"
              className="h-20 flex-col gap-2"
            >
              <Link href={action.href}>
                <Icon className="h-5 w-5" />
                {action.title}
              </Link>
            </Button>
          );
        })}

      </CardContent>

    </Card>
  );
}