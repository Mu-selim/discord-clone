"use client";

import { useRouter, useParams } from "next/navigation";

import { Member, MemberRole, Profile, Server } from "@prisma/client";

import { cn } from "@/lib/utils";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { UserAvatar } from "@/components/userAvatar";

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: Server;
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  [MemberRole.OWNER]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};

export function ServerMember({ member, server }: ServerMemberProps) {
  const router = useRouter();
  const params = useParams();

  const icon = roleIconMap[member.role];
  return (
    <button
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar src={member.profile.imageURL} name={member.profile.name} className="size-8 md:size-10" />
      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id && "text-primary dark:text-zinc-200"
        )}
      >
        {member.profile.name}
      </p>{" "}
      {icon}
    </button>
  );
}
