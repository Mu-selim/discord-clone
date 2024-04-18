import { redirect } from "next/navigation";
import { initializedProfile } from "@/lib/initializedProfile";
import { db } from "@/lib/db";

export default async function SetupProfilePage() {
  const profile = await initializedProfile();

  const server = await db.server.findFirst({
    where: { members: { some: { id: profile.id } } },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>Create a server</div>;
}
