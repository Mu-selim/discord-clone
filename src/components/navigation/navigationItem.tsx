"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/actionTooltip";

type NavigationItemProps = {
  id: string;
  imageURL: string;
  name: string;
};

export function NavigationItem({ id, imageURL, name }: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const onClick = () => router.push(`/servers/${id}`);

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 w-1 rounded-r-full bg-primary transition-all",

            params?.serverId !== id && "group-hover:h-5",
            params?.serverId === id ? "h-9" : "h-2"
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex size-12 overflow-hidden rounded-3xl transition-all group-hover:rounded-2xl",
            params?.serverId === id && "rounded-2xl bg-primary/10 text-primary"
          )}
        >
          <Image fill src={imageURL} alt={`${name} server`} />
        </div>
      </button>
    </ActionTooltip>
  );
}
