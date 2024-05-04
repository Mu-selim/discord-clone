import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { findOrCreateConversations } from "@/lib/conversations";
import { ChatHeader } from "@/components/chat/chatHeader";

type MemberIdPageProps = {
  params: { serverId: string; id: string };
};

export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: { serverId: params.serverId, profileId: profile.id },
    include: { profile: true },
  });
  if (!currentMember) return redirect("/");

  const conversation = await findOrCreateConversations(currentMember.id, params.id);
  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={otherMember.profile.name}
        type="conversation"
        serverId={params.serverId}
        imgURL={otherMember.profile.imageURL}
      />
    </div>
  );
}
