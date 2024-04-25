import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId) return new NextResponse("Server ID Missing", { status: 400 });

    await db.server.delete({
      where: { id: params.serverId, profileId: profile.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[ERROR DELETING SERVER]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
