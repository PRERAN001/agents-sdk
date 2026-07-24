import PageContainer from "@/components/shared/PageContainer";
import ProjectHeader from "../../../../components/project/ProjectHeader";
import ProjectStats from "../../../../components/project/ProjectStats";
import ProjectTabs from "../../../../components/project/ProjectTabs";
import LatestDeployment from "../../../../components/project/LatestDeployment";
import EndpointCard from "../../../../components/project/EndpointCard";
import TasksCard from "../../../../components/project/TasksCard";
import EnvironmentCard from "../../../../components/project/EnvironmentCard";

export default function ProjectPage() {
  return (
    <PageContainer className="space-y-8">

      <ProjectHeader />

      <ProjectStats />

      <ProjectTabs />

      <div className="grid gap-6 lg:grid-cols-2">

        <LatestDeployment />

        <EndpointCard />

        <TasksCard />

        <EnvironmentCard />

      </div>

    </PageContainer>
  );
}