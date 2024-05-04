import { NextApiRequest } from "next";
import { NextServerIOApiResponse } from "@/types";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextServerIOApiResponse) {
  if (req.method !== "DELETE" && req.method !== "PATCH")
    return res.status(405).json({ error: "method is not allowed" });

  try {
    const profile = await currentProfilePages(req);
    if (!profile) return res.status(401).json({ error: "unauthorized" });

    const { serverId, channelId, messageId } = req.query;
    if (!serverId) return res.status(401).json({ error: "missing server ID" });
    if (!channelId) return res.status(401).json({ error: "missing channel ID" });
    if (!messageId) return res.status(401).json({ error: "missing message ID" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    });
    if (!server) return res.status(404).json({ message: "server not found" });

    const channel = await db.channel.findFirst({
      where: { id: channelId as string, serverId: serverId as string },
    });
    if (!channel) return res.status(404).json({ message: "channel not found" });

    const member = server.members.find((member) => member.profileId === profile.id);
    if (!member) return res.status(404).json({ message: "member not found" });

    let message = await db.message.findFirst({
      where: { id: messageId as string, channelId: channelId as string },
      include: { member: { include: { profile: true } } },
    });
    console.log(message);
    if (!message || message.deleted) return res.status(404).json({ message: "message not found" });

    const isMessageOwner = message.memberId === member.id;
    const isServerOwner = member.role === MemberRole.OWNER;
    const isAdmin = member.role === MemberRole.ADMIN;
    const canModify = isMessageOwner || isServerOwner || isAdmin;
    if (!canModify) return res.status(401).json({ error: "unauthorized" });

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: { id: messageId as string },
        data: { fileURL: null, content: "this message has been deleted", deleted: true },
        include: { member: { include: { profile: true } } },
      });
    }

    const { content } = req.body;
    if (req.method === "PATCH") {
      if (!isMessageOwner) return res.status(401).json({ error: "unauthorized" });

      message = await db.message.update({
        where: { id: messageId as string },
        data: { content },
        include: { member: { include: { profile: true } } },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]");
    console.log(error);
  }
}
