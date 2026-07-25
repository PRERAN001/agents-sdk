"use client";

import { useState, useEffect, use } from "react";
import PageContainer from "@/components/shared/PageContainer";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectStats from "@/components/project/ProjectStats";
import ProjectTabs from "@/components/project/ProjectTabs";
import LatestDeployment from "@/components/project/LatestDeployment";
import EndpointCard from "@/components/project/EndpointCard";
import TasksCard from "@/components/project/TasksCard";
import EnvironmentCard from "@/components/project/EnvironmentCard";
import NoProjectsEmptyState from "@/components/projects/NoProjectsEmptyState";
import NewProjectModal from "@/components/projects/NewProjectModal";
import { Loader2 } from "lucide-react";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch (e) {
      console.error("Failed to fetch project:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500">Loading Agent Dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <div className="py-12 space-y-6">
          <NoProjectsEmptyState onCreateClick={() => setIsNewProjectOpen(true)} />
          <NewProjectModal
            isOpen={isNewProjectOpen}
            onClose={() => setIsNewProjectOpen(false)}
            onSuccess={fetchProject}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <ProjectHeader project={project} />
        <ProjectStats status={project.status || "Running"} />
        <ProjectTabs />

        <div className="grid gap-6 lg:grid-cols-2">
          <LatestDeployment project={project} />
          <EndpointCard runtimeUrl={project.runtimeUrl} />
          <TasksCard runtimeUrl={project.runtimeUrl} />
          <EnvironmentCard />
        </div>

        <NewProjectModal
          isOpen={isNewProjectOpen}
          onClose={() => setIsNewProjectOpen(false)}
          onSuccess={fetchProject}
        />
      </div>
    </PageContainer>
  );
}