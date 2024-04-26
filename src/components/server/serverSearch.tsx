"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

type ServerSearchProps = {
  data: {
    type: "channel" | "member";
    label: string;
    data:
      | {
          icon: ReactNode;
          id: string;
          name: string;
        }[]
      | undefined;
  }[];
};

export function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((state) => !state);
      }
    };

    window.addEventListener("keydown", onKeydown);
    () => window.removeEventListener("keydown", onKeydown);
  }, []);

  const onClick = ({ id, type }: { id: string; type: (typeof data)[number]["type"] }) => {
    setOpen(false);
    if (type === "member") return router.push(`/servers/${params.serverId}/conversations/${id}`);
    if (type === "channel") return router.push(`/servers/${params.serverId}/channels/${id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-x-2 rounded-md bg-zinc-700/10 p-2 transition dark:bg-zinc-700/50"
      >
        <Search className="size-4 text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
          Search
        </p>
        <kbd className="pointer-events-none ml-auto flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-[10px]">⌘</span> <span>K</span>
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for channels or members" />
        <CommandList>
          <CommandEmpty className="py-6 text-center">No results found</CommandEmpty>
          {data.map((entry) => {
            const { type, label, data } = entry;
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map((item) => {
                  const { id, name, icon } = item;

                  return (
                    <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
