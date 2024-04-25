import { NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId) return new NextResponse("Server ID Missing", { status: 400 });

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { inviteCode: uuidV4() },
    });
    if (!server) return new NextResponse("Server Not Found", { status: 404 });
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("[ERROR CREATING NEW INVITE CODE]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
