import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId) return new NextResponse("Server ID Missing", { status: 400 });

    const { name, image } = await req.json();

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { name, imageURL: image },
    });
    return new NextResponse(JSON.stringify(server), { status: 200 });
  } catch (error) {
    console.log("[ERROR EDITING SERVER DETAILS]");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
