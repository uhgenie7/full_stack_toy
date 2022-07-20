import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
import { fetcher } from "../queryClient";
import { GET_MESSAGES } from "../graphql/message";

// import useInfiniteScroll from "../hooks/useInfiniteScroll";

interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

const MsgList = ({ smsgs, users }) => {
  const {
    query: { userId = "" },
  } = useRouter();
  // const { userId } = query;
  const UserIds = ["roy", "jay"];
  const [msgs, setMsgs] = useState<Message[]>(smsgs);
  const [editingId, setEditingId] = useState(null);
  // const [hasNext, setHasNext] = useState(true);
  // const fetchMoreEl = useRef(null);
  // const intersecting = useInfiniteScroll(fetchMoreEl);

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("somethin wrong");
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error("something wrong");
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(
        targetIndex,
        1,
        newMsg
        //   {
        //   ...msgs[targetIndex],
        //   text,
        // }
      );
      return newMsgs;
    });
    doneEdit();
  };

  const doneEdit = () => setEditingId(null);

  const onDelete = async (id) => {
    // Error
    // const receivedId = await fetcher("delete", `/messages/${id}`, { userId });
    // Success
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    // 또는
    // const receivedId = await fetcher(
    //   "delete",
    //   `/messages/${id}?userId=${userId}`
    // );

    setMsgs((msgs) => {
      // const targetIndex = msgs.findIndex((msg) => msg.id === id);
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + "");
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    doneEdit();
  };

  const { data, error, isError } = useQuery("MESSAGES", GET_MESSAGES);

  const getMessages = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });

    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  // useEffect(() => {
  //   if (intersecting && hasNext) getMessages();
  // }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            onUpdate={onUpdate}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            onDelete={() => onDelete(x.id)}
            myId={userId}
            user={users[x.userId]}
            {...x}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
