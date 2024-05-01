import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chatHeader";
import { ChatInput } from "@/components/chat/chatInput";
import { ChatMessages } from "@/components/chat/chatMessages";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    id: string;
  };
};

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: { id: params.id },
  });
  const member = await db.member.findFirst({
    where: { serverId: params?.serverId, profileId: profile.id },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader serverId={channel.serverId} name={channel.name} type="channel" />
      <ChatMessages
        name={channel.name}
        member={member}
        chatId={channel.id}
        apiURL="/api/messages"
        socketURL="/api/socket/messages"
        socketQuey={{ serverId: channel.serverId, channelId: channel.id }}
        paramKey="channelId"
        paramValue={channel.id}
        type="channel"
      />

      <ChatInput
        apiURL="/api/socket/messages"
        name={channel.name}
        type="channel"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
}
