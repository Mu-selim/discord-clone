"use client";

import { Member } from "@prisma/client";
import { ChatWelcome } from "@/components/chat/chatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { MessageWithMemberWithProfile } from "@/types";

type ChatMessagesProps = {
  name: string;
  member: Member;
  chatId: string;
  apiURL: string;
  socketURL: string;
  socketQuey: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

export function ChatMessages({
  name,
  member,
  chatId,
  apiURL,
  socketURL,
  socketQuey,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useChatQuery({
    queryKey,
    apiURL,
    paramKey,
    paramValue,
  });

  if (isFetching) return <FetchingStatusMessage status="loading" />;
  if (status === "error") return <FetchingStatusMessage status="error" />;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
      <div className="mt-auto flex flex-col-reverse">
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => <div key={message.id}>{message.content}</div>)}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function FetchingStatusMessage({ status }: { status: "loading" | "error" }) {
  const iconMap: Record<typeof status, JSX.Element> = {
    loading: <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />,
    error: <ServerCrash className="my-4 size-7 text-zinc-500" />,
  };

  const messageMap: Record<typeof status, string> = {
    loading: "Loading messages ...",
    error: "Something went wrong!",
  };

  const icon = iconMap[status];
  const message = messageMap[status];

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {icon}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}
