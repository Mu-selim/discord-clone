"use client";

import { useRouter, useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";

import { ActionTooltip } from "@/components/actionTooltip";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";

type ServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.VOICE]: Mic,
  [ChannelType.VIDEO]: Video,
};

export function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const router = useRouter();
  const params = useParams();

  const Icon = iconMap[channel.type];
  return (
    <button
      onClick={() => {}}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id && "text-primary dark:text-zinc-200"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && <Lock className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />}
    </button>
  );
}
