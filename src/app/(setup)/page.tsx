import { redirect } from "next/navigation";
import { initializedProfile } from "@/lib/initializedProfile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initailModal";

export default async function SetupProfilePage() {
  const profile = await initializedProfile();

  const server = await db.server.findFirst({
    where: { members: { some: { profileId: profile.id } } },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
