"use client";

import { Member } from "@prisma/client";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatSocket } from "@/hooks/useChatSocket";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { MessageWithMemberWithProfile } from "@/types";
import { ChatWelcome } from "@/components/chat/chatWelcome";
import { ChatItem } from "@/components/chat/chatItem";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

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
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useChatQuery({
    queryKey,
    apiURL,
    paramKey,
    paramValue,
  });
  useChatSocket({queryKey, addKey, updateKey, })

  if (isFetching) return <FetchingStatusMessage status="loading" />;
  if (status === "error") return <FetchingStatusMessage status="error" />;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
      <div className="mt-auto flex flex-col-reverse">
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group?.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileURL={message.fileURL}
                deleted={message.deleted}
                currentMember={member}
                isUpdated={message.updatedAt !== message.createdAt}
                socketURL={socketURL}
                socketQuery={socketQuey}
              />
            ))}
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
