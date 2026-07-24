"use client";

import Link from "next/link";

import {
  User,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  name: string;
  email: string;
  image?: string;
}

export default function UserDropdown({
  name,
  email,
  image,
}: UserDropdownProps) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2">

          <Avatar>

            <AvatarImage src={image} />

            <AvatarFallback>
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>

          </Avatar>

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        <DropdownMenuLabel>

          <p className="font-medium">{name}</p>

          <p className="text-xs text-muted-foreground">
            {email}
          </p>

        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>

          <Link href="/dashboard/profile">

            <User className="mr-2 h-4 w-4" />

            Profile

          </Link>

        </DropdownMenuItem>

        <DropdownMenuItem asChild>

          <Link href="/dashboard/billing">

            <CreditCard className="mr-2 h-4 w-4" />

            Billing

          </Link>

        </DropdownMenuItem>

        <DropdownMenuItem asChild>

          <Link href="/dashboard/settings">

            <Settings className="mr-2 h-4 w-4" />

            Settings

          </Link>

        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500">

          <LogOut className="mr-2 h-4 w-4" />

          Logout

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}