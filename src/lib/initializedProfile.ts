import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function initializedProfile() {
  const user = await currentUser();

  if (!user) return redirectToSignIn();

  const profile = await db.profile.findUnique({ where: { userId: user.id } });
  if (profile) return profile;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageURL: user.imageUrl,
    },
  });

  return newProfile;
}
