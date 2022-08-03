import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import fetcher from "../../api";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../constants/QueryKeys";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { Message, METHOD, Users, IMutation, MsgQueryData } from "../../types";
import { getNewMessages, findTargetMsgIndex } from "../common/queryClient";
import MsgList from "../UI/MsgList";

const MsgListFetcher = ({
  smsgs,
  users,
}: {
  smsgs: Message[];
  users: Users;
}) => {
  // Access the client
  const queryClient = useQueryClient();
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const [msgs, setMsgs] = useState<Message[]>(smsgs);
  const [hasNext, setHasNext] = useState(true);

  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  // Queries
  const { data, isLoading, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
    fetcher(METHOD.GET, "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    })
  );

  const { mutate: onCreate } = useMutation(
    ({ text }: IMutation) => fetcher(METHOD.POST, "messages", { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        queryClient.setQueryData<MsgQueryData>(QueryKeys.MESSAGES, (old) => {
          if (!old)
            return { pages: [{ messages: [createMessage] }], pageParams: "" };
          return {
            pageParams: old.pageParams,
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
          };
        });
      },
    }
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }: IMutation) =>
      fetcher(METHOD.PUT, `/messages/${id}`, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        queryClient.setQueryData<MsgQueryData>(QueryKeys.MESSAGES, (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: "" };

          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            updateMessage.id
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1, updateMessage);
          return newMsgs;
        });
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(METHOD.DELETE, `/messages/${id}`, { params: { userId } }),
    {
      onSuccess: ({ deleteMessage: deletedId }) => {
        queryClient.setQueryData<MsgQueryData>(QueryKeys.MESSAGES, (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: "" };
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            deletedId
          );
          if (pageIndex < 0 || msgIndex < 0) return old;

          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1);
          return newMsgs;
        });
      },
    }
  );

  if (isLoading) {
    return <p>wait</p>;
  }

  return (
    <>
      <MsgList
        msgs={data}
        users={users}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgListFetcher;
