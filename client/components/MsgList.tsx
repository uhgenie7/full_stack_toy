import { useEffect, useState } from "react";
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
  id: number;
  userId: string;
  timestamp: number;
  text: string;
}

const MsgList = () => {
  const UserIds = ["roy", "jay"];
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [editingId, setEditingId] = useState(null);
  const getRandomUserId = (): string => UserIds[Math.round(Math.random())];

  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = (text, id) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, {
        ...msgs[targetIndex],
        text,
      });
      return newMsgs;
    });
    doneEdit();
  };

  const doneEdit = () => setEditingId(null);

  const onDelete = (id) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    doneEdit();
  };

  useEffect(async () => {
    // const settingMsg = Array(50)
    //   .fill(0)
    //   .map((_, i) => ({
    //     id: 50 - i,
    //     userId: getRandomUserId(),
    //     timestamp: 1234567890123 + (50 - i) * 1000 * 60,
    //     text: `${50 - i} mock text`,
    //   }));
    // setMsgs(settingMsg);
    // console.log(JSON.stringify(settingMsg));
    const msgs = await fetcher("get", "/messages");
    setMsgs(msgs);
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
            {...x}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
