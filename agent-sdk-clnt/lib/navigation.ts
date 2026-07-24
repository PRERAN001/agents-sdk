import {
  LayoutDashboard,
  FolderGit2,
  Rocket,
  PlayCircle,
  KeyRound,
  ScrollText,
  Settings,
} from "lucide-react";

export const dashboardNav = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderGit2,
  },
  {
    title: "Deployments",
    href: "/dashboard/deployments",
    icon: Rocket,
  },
  {
    title: "Executions",
    href: "/dashboard/executions",
    icon: PlayCircle,
  },
  {
    title: "Secrets",
    href: "/dashboard/secrets",
    icon: KeyRound,
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: ScrollText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];