"use client";

import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Member, MemberRole, Profile } from "@prisma/client";

import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { UserAvatar } from "@/components/userAvatar";
import { ActionTooltip } from "@/components/actionTooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type ChatItemProps = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileURL: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketURL: string;
  socketQuery: Record<string, string>;
};

const roleIconMap: Record<MemberRole, JSX.Element | null> = {
  OWNER: <ShieldAlert className="ml-2 size-4 text-red-500" />,
  ADMIN: <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  GUEST: null,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileURL,
  deleted,
  currentMember,
  isUpdated,
  socketURL,
  socketQuery,
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: content },
  });
  console.log(form.getValues("content"));

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) setIsEditing(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({ content: content });
  }, [content, form]);

  const fileType = fileURL?.split(".").pop();

  const isLoading = form.formState.isSubmitting;
  const isServerOwner = currentMember.role === MemberRole.OWNER;
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isOwner || isAdmin || isServerOwner);
  const canEditMessage = !deleted && isOwner && !fileURL;
  const isPDF = fileURL && fileType === "pdf";
  const isImage = fileURL && !isPDF;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketURL}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      setIsEditing(false);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar name={member.profile.name} src={member.profile.imageURL} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-sm font-semibold hover:underline">{member.profile.name}</p>
              <ActionTooltip label={member.role}>{roleIconMap[member.role]}</ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square size-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image src={fileURL} alt={content} fill className="object-cover" />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              >
                PDF file
              </a>
            </div>
          )}
          {!fileURL && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted && "mt-1 text-xs italic text-zinc-500 dark:text-zinc-400"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">{"(edited)"}</span>
              )}
            </p>
          )}
          {!fileURL && isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-x-2 pt-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            placeholder="edit message"
                            autoComplete="off"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary" disabled={isLoading}>
                  save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="delete">
            <Trash className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-300" />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
