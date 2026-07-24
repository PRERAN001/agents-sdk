import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { Button } from "@/components/ui/button";

import {
  FolderGit2,
  Rocket,
  Bot,
  PlayCircle,
  Plus,
} from "lucide-react";

import PageContainer from "@/components/shared/PageContainer";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import SystemStatus from "@/components/dashboard/SystemStatus";
import ProjectCard from "@/components/dashboard/ProjectCard";
import SectionHeader from "@/components/shared/SectionHeader";
import ActivityCard from "@/components/dashboard/ActivityCard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <PageContainer>

      <div className="flex items-center justify-between">

        <WelcomeBanner
          name={session.user?.name ?? "Developer"}
        />

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>

      </div>

      <StatsGrid>

        <StatCard
          title="Projects"
          value={4}
          icon={FolderGit2}
          description="Across all workspaces"
        />

        <StatCard
          title="Deployments"
          value={17}
          icon={Rocket}
          description="Total deployments"
        />

        <StatCard
          title="Running Agents"
          value={3}
          icon={Bot}
          description="Currently online"
        />

        <StatCard
          title="Executions"
          value={241}
          icon={PlayCircle}
          description="Tasks executed"
        />

      </StatsGrid>

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="space-y-6 xl:col-span-2">

          <section>

            <SectionHeader
              title="Recent Projects"
              description="Continue working on your latest agents."
            />

            <div className="mt-4 grid gap-6 lg:grid-cols-2">

              <ProjectCard
                id="1"
                name="PDF Summarizer"
                description="Summarize documents using AI."
                github="github.com/preran/pdf-agent"
                status="Running"
              />

              <ProjectCard
                id="2"
                name="Customer Support"
                description="Autonomous support assistant."
                github="github.com/preran/support-agent"
                status="Deploying"
              />

            </div>

          </section>

          <section>

            <SectionHeader
              title="Recent Activity"
              description="Latest actions across your workspace."
            />

            <div className="mt-4 space-y-3">

              <ActivityCard
                title="Deployment Completed"
                subtitle="PDF Summarizer deployed successfully."
                time="2 min ago"
              />

              <ActivityCard
                title="Execution Finished"
                subtitle="Customer Support Agent processed 42 requests."
                time="12 min ago"
              />

              <ActivityCard
                title="GitHub Synced"
                subtitle="Repository updated from main branch."
                time="25 min ago"
              />

            </div>

          </section>

        </div>

        <div className="space-y-6">

          <QuickActions />

          <SystemStatus />

        </div>

      </div>

    </PageContainer>
  );
}