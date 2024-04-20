"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

type ServerHeaderProps = {
  server: ServerWithMembersWithProfile;
  role?: MemberRole;
};

export function ServerHeader({ server, role }: ServerHeaderProps) {
  const isOwner = role === MemberRole.OWNER;
  const isAdmin = isOwner || role === MemberRole.ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="ml-auto size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-0.5 text-xs font-medium text-black dark:text-neutral-400">
        {isOwner && (
          <DropdownMenuItem className="flex cursor-pointer items-center px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400">
            <span>Invite People</span>
            <UserPlus className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isOwner && (
          <DropdownMenuItem className="flex cursor-pointer items-center px-3 py-2 text-sm">
            <span>Server Settings</span>
            <Settings className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isOwner && (
          <DropdownMenuItem className="flex cursor-pointer items-center px-3 py-2 text-sm">
            <span>Manage Members</span>
            <Users className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="flex cursor-pointer items-center px-3 py-2 text-sm">
            <span>Create Channel</span>
            <PlusCircle className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && <DropdownMenuSeparator />}
        {isOwner && (
          <DropdownMenuItem className="flex cursor-pointer items-center px-3 py-2 text-sm">
            <span>Delete Server</span>
            <Trash className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
