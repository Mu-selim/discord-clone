import { db } from "@/lib/db";

export async function findOrCreateConversations(memberOneId: string, memberTwoId: string) {
  const conversation =
    (await findConversations(memberOneId, memberTwoId)) || (await findConversations(memberTwoId, memberOneId));
  if (conversation) return conversation;

  return await createNewConversations(memberOneId, memberTwoId);
}

async function findConversations(memberOneId: string, memberTwoId: string) {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
    return conversation;
  } catch {
    console.log("[ERROR FINDING CONVERSATION]");
    return null;
  }
}

async function createNewConversations(memberOneId: string, memberTwoId: string) {
  try {
    const conversation = await db.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
    return conversation;
  } catch {
    console.log("[ERROR CREATING CONVERSATION]");
    return null;
  }
}
