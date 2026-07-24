import Link from "next/link";
import { ArrowUpRight,  Rocket } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  github: string;
  status: "Running" | "Stopped" | "Deploying";
}

export default function ProjectCard({
  id,
  name,
  description,
  github,
  status,
}: ProjectCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">

      <CardHeader>

        <div className="flex items-center justify-between">

          <CardTitle>{name}</CardTitle>

          <Badge>{status}</Badge>

        </div>

        <CardDescription>{description}</CardDescription>

      </CardHeader>

      <CardContent>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">

          

          {github}

        </div>

      </CardContent>

      <CardFooter className="flex justify-between">

        <Button asChild variant="outline">

          <Link href={`/dashboard/projects/${id}`}>
            Open
            <ArrowUpRight className="ml-2 h-4 w-4"/>
          </Link>

        </Button>

        <Button>

          <Rocket className="mr-2 h-4 w-4"/>

          Deploy

        </Button>

      </CardFooter>

    </Card>
  );
}