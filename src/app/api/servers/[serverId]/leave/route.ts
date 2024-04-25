import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId) return new NextResponse("Server ID Missing", { status: 400 });

    console.log("PROFILE", profile);

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: { not: profile.id },
        members: { some: { profileId: profile.id } },
      },
      data: {
        members: {
          deleteMany: { profileId: profile.id },
        },
      },
    });
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (err) {
    console.log("[SERVER CREATION ERROR]");
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
