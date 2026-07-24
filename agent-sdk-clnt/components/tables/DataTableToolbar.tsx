"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  action?: React.ReactNode;
}

export default function DataTableToolbar({
  searchPlaceholder = "Search...",
  action,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:max-w-sm">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder={searchPlaceholder}
          className="pl-9"
        />

      </div>

      <div className="flex items-center gap-2">

        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>

        {action}

      </div>

    </div>
  );
}