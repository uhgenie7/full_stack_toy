import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import MsgInput from "./MsgInput";

import MsgItem from "./MsgItem";
import fetcher from "../fetcher";

import useInfiniteScroll from "../hooks/useInfiniteScroll";

// const msgs = [
//   {
//     id: 1,
//     userId: getRandomUserId(),
//     timestamp: 1234567890123,
//     text: "1 mock text",
//   },
// ];

interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

const MsgList = () => {
  const {
    query: { userId = "" },
  } = useRouter();
  // const { userId } = query;
  const UserIds = ["roy", "jay"];
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState(null);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

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

  const getMessages = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });

    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting) getMessages();
  }, [intersecting]);

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
            {...x}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
