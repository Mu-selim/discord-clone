import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) return new NextResponse("Server ID missing", { status: 400 });

    if (!params.channelId) return new NextResponse("Channel ID missing", { status: 400 });

    const { name, type } = await req.json();

    if (name === "general") return new NextResponse("Channel name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.OWNER, MemberRole.ADMIN] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: { id: params.channelId, NOT: { name: "general" } },
            data: { name, type },
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("[ERROR UPDATE CHANNEL]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) return new NextResponse("Server ID missing", { status: 400 });

    if (!params.channelId) return new NextResponse("Channel ID missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.OWNER, MemberRole.ADMIN] },
          },
        },
      },
      data: {
        channels: {
          delete: { id: params.channelId, name: { not: "general" } },
        },
      },
    });
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("[ERROR DELETE CHANNEL]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
