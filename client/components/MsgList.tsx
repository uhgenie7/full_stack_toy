import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQueryClient, useMutation, useInfiniteQuery } from "react-query";
import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
import { fetcher, QueryKeys } from "../queryClient";
import {
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  GET_MESSAGES,
  DELETE_MESSAGE,
} from "../graphql/message";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

const findTargetMsgIndex = (pages, id) => {
  let msgIndex = -1;
  const pageIndex = pages.findIndex(({ messages }) => {
    msgIndex = messages.findIndex((msg) => msg.id === id);
    if (msgIndex > -1) {
      return true;
    }
    return false;
  });
  return { pageIndex, msgIndex };
};

const MsgList = ({ smsgs, users }) => {
  const client = useQueryClient();
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const [msgs, setMsgs] = useState([{ messages: smsgs }]);
  const [editingId, setEditingId] = useState(null);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        // pages: [{messages:[createMessage, 15]}, {messages:[15]}, {messages:[15]}]
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            pageParam: old.pageParam,
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
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        doneEdit();
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          // pages: [{messages:[15]}, {messages:[1, 2, ... **7**, 8, ...15]}, {messages:[10]}]

          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            updateMessage.id
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newPages = [...old.pages];
          newPages[pageIndex] = { messages: [...newPages[pageIndex].messages] };
          newPages[pageIndex].messages.splice(msgIndex, 1, updateMessage);
          return { pagePara: old.pageParam, pages: newPages };
        });
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      // pages: [{messages:[14]}, {messages:[14]}, {messages:[10]}]
      onSuccess: ({ deleteMessage: deletedId }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === deletedId
          );
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1);
          return { messages: newMsgs };
        });
      },
    }
  );

  const doneEdit = () => setEditingId(null);

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = "" }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => {
        //getNextPageParam: 다음 요청이 있을 시 리턴한 pageParam이 담길 것
        // console.log(res);
        return messages?.[messages.length - 1]?.id;
      },
    }
  );

  useEffect(() => {
    if (!data?.pages) return;
    setMsgs(data.pages);
  }, [data?.pages]);

  if (isError) {
    console.error(error);
    return null;
  }

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage();
  }, [intersecting, hasNextPage]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map(({ messages }, pageIndex) =>
          messages.map((x) => (
            <MsgItem
              key={pageIndex + x.id}
              {...x}
              onUpdate={onUpdate}
              onDelete={() => onDelete(x.id)}
              startEdit={() => setEditingId(x.id)}
              isEditing={editingId === x.id}
              myId={userId}
            />
          ))
        )}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
