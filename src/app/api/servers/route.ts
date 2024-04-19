import { v4 as uuidV4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, image } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageURL: image,
        inviteCode: uuidV4(),
        channels: { create: [{ name: "general", profileId: profile.id }] },
        members: { create: [{ profileId: profile.id, role: MemberRole.OWNER }] },
      },
    });
    return new NextResponse(JSON.stringify(server), { status: 201 });
  } catch (err) {
    console.log("[SERVER CREATION ERROR]");
    console.log(err);
    return new NextResponse("Error creating server", { status: 500 });
  }
}
