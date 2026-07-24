"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  "overview",
  "deployments",
  "playground",
  "executions",
  "logs",
  "secrets",
  "settings",
];

export default function ProjectTabs() {

  const pathname = usePathname();

  return (
    <div className="flex gap-6 border-b">

      {tabs.map((tab) => {

        const href =
          tab === "overview"
            ? pathname
            : `${pathname}/${tab}`;

        return (
          <Link
            key={tab}
            href={href}
            className="pb-4 capitalize text-sm hover:text-primary"
          >
            {tab}
          </Link>
        );

      })}

    </div>
  );
}