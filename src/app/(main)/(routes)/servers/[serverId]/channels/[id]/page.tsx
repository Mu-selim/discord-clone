import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chatHeader";

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
    <div className="h-full w-full bg-white dark:bg-[#313338]">
      <ChatHeader serverId={channel.serverId} name={channel.name} type="channel" />
    </div>
  );
}
