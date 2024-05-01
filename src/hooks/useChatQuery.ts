import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSocket } from "@/components/providers/socketProvider";

type ChatQueryProps = {
  queryKey: string;
  apiURL: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export function useChatQuery({ queryKey, apiURL, paramKey, paramValue }: ChatQueryProps) {
  const { isConnected } = useSocket();
  const params = useParams();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiURL,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery(
    // @ts-ignore
    {
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    }
  );

  return { data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching };
}
