import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) return new NextResponse("Sever ID missing", { status: 400 });

    const { name, type } = await req.json();
    if (name === "general") return new NextResponse("Channel name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.OWNER] },
          },
        },
      },
      data: {
        channels: { create: { profileId: profile.id, type, name } },
      },
    });
    return new NextResponse(JSON.stringify(server), { status: 201 });
  } catch (error) {
    console.log("[ERROR CREATE CHANNEL]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
