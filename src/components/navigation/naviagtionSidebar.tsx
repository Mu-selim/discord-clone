import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationActions } from "@/components/navigation/navigationActions";
import { NavigationItem } from "@/components/navigation/navigationItem";
import { ModeToggle } from "@/components/modeToggle";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";

export async function NavigationSidebar() {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({ where: { members: { some: { profileId: profile.id } } } });

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 py-3 border-e shadow text-primary dark:border-e-0 dark:bg-[#1e1f22]">
      {/* Create a new server */}
      <NavigationActions />
      <Separator className="mx-auto h-0.5 w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      {/* List of servers */}
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem id={server.id} imageURL={server.imageURL} name={server.name} />
          </div>
        ))}
      </ScrollArea>
      {/* Theme toggle and user button */}
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "size-11" } }} />
      </div>
    </div>
  );
}
