import { NextServerIOApiResponse } from "@/types";
import { NextApiRequest } from "next";
import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextServerIOApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  try {
    const profile = await currentProfilePages(req);
    if (!profile) return res.status(401).json({ error: "unauthorized" });

    const { serverId, channelId } = req.query;
    if (!serverId) return res.status(401).json({ error: "missing server ID" });
    if (!channelId) return res.status(401).json({ error: "missing channel ID" });

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

    const { content, fileURL } = req.body;
    const message = await db.message.create({
      data: { content, fileURL, channelId: channelId as string, memberId: member.id },
      include: { member: { include: { profile: true } } },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[ERROR Messages POST]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
