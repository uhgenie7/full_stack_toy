import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MsgInput from "./MsgInput";

import MsgItem from "./MsgItem";
import fetcher from "../fetcher";

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
  const getRandomUserId = (): string => UserIds[Math.round(Math.random())];

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("somethin wrong");
    // const newMsg = {
    //   id: msgs.length + 1,
    //   userId: getRandomUserId(),
    //   timestamp: Date.now(),
    //   text: `${msgs.length + 1} ${text}`,
    // };
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
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    doneEdit();
  };

  const getMessages = async () => {
    const msgs = await fetcher("get", "/messages");
    setMsgs(msgs);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <>
      <MsgInput mutate={onCreate} />
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
    </>
  );
};

export default MsgList;
