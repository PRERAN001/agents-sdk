
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FolderGit2,
  Rocket,
  PlayCircle,
  KeyRound,
  ScrollText,
  Settings,
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";

const navItems = [
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
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r bg-background lg:flex lg:flex-col">

      {/* Logo */}
      <div className="border-b p-6">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">

        {navItems.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (

            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",

                active
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />

              {item.title}
            </Link>

          );
        })}
      </nav>

      {/* Footer */}

      <div className="border-t p-4">

        <Link
          href="/help"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
        >
          <HelpCircle className="h-5 w-5" />

          Help
        </Link>

      </div>

    </aside>
  );
}