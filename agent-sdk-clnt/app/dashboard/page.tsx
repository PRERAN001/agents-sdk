"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Rocket,
  Bot,
  PlayCircle,
  Plus,
  Loader2,
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
import NoProjectsEmptyState from "@/components/projects/NoProjectsEmptyState";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
          <p className="text-sm text-zinc-500 mt-2">Loading DeployGent Dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header & New Project CTA -> Navigates directly to GitHub Integration Repository List */}
      <div className="flex items-center justify-between">
        <WelcomeBanner name={session?.user?.name ?? "Developer"} />
        <Link href="/dashboard/repositories">
          <Button className="font-semibold gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <StatsGrid>
        <StatCard
          title="Projects"
          value={projects.length}
          icon={FolderGit2}
          description="Active workspaces"
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

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section>
            <SectionHeader
              title="Recent Projects"
              description="Continue working on your latest agent deployments."
            />

            {loadingProjects ? (
              <div className="py-12 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 mt-4">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-500">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-4">
                <NoProjectsEmptyState onCreateClick={() => (window.location.href = "/dashboard/repositories")} />
              </div>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {projects.map((proj) => (
                  <ProjectCard
                    key={proj._id || proj.name}
                    id={proj._id || "1"}
                    name={proj.name}
                    description={proj.description || "DeployGent Agent Workflow"}
                    github={proj.githubRepo || "github.com/deploygent/agent"}
                    status={proj.status || "Running"}
                  />
                ))}
              </div>
            )}
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