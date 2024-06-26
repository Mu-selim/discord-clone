import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ServerHeader } from "@/components/server/serverHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/serverSearch";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "@/components/server/serverSection";
import { ServerChannel } from "@/components/server/serverChannel";
import { ServerMember } from "@/components/server/serverMember";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.VOICE]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};

const roleMap = {
  [MemberRole.OWNER]: <ShieldAlert className="mr-2 size-4 text-rose-500" />,
  [MemberRole.ADMIN]: <ShieldCheck className="mr-2 size-4 text-indigo-500" />,
  [MemberRole.GUEST]: null,
};

export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: "asc" } },
      members: { include: { profile: true }, orderBy: { role: "asc" } },
    },
  });
  if (!server) return redirect("/");

  const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const voiceChannels = server.channels.filter((channel) => channel.type === ChannelType.VOICE);
  const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const otherMembers = server.members.filter((member) => member.profileId !== profile.id);
  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex h-full w-full flex-col bg-[#f2f3f5] text-primary dark:bg-[#2b2d31]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                type: "channel",
                label: "Text Channels",
                data: textChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  id: channel.id,
                  name: channel.name,
                })),
              },
              {
                type: "channel",
                label: "Voice Channels",
                data: voiceChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  id: channel.id,
                  name: channel.name,
                })),
              },
              {
                type: "channel",
                label: "Video Channels",
                data: videoChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  id: channel.id,
                  name: channel.name,
                })),
              },
              {
                type: "member",
                label: "Members",
                data: otherMembers.map((member) => ({
                  icon: roleMap[member.role],
                  id: member.id,
                  name: member.profile.name,
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection label="Text Channels" role={role} sectionType="channels" channelType={ChannelType.TEXT} />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!voiceChannels?.length && (
          <div className="mb-2">
            <ServerSection label="Voice Channels" role={role} sectionType="channels" channelType={ChannelType.VOICE} />
            <div className="space-y-[2px]">
              {voiceChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection label="Video Channels" role={role} sectionType="channels" channelType={ChannelType.VIDEO} />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
              ))}
            </div>
          </div>
        )}
        {!!otherMembers?.length && (
          <div className="mb-2">
            <ServerSection label="Members" role={role} sectionType="members" server={server} />
            <div className="space-y-[2px]">
              {otherMembers.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
