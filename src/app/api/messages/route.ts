import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!channelId) return new NextResponse("Channel ID missing", { status: 400 });

    let messages: Message[] = [];
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { channelId },
        include: {
          member: { include: { profile: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: { channelId },
        include: {
          member: { include: { profile: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }
    return new NextResponse(JSON.stringify({ items: messages, nextCursor }), { status: 200 });
  } catch (error) {
    console.log("[ERROR GETTING MESSAGES]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
