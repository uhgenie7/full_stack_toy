import { useEffect, useState } from "react";
import MsgInput from "./MsgInput";

import MsgItem from "./MsgItem";

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
  const getRandomUserId = (): string => UserIds[Math.round(Math.random())];

  useEffect(() => {
    const settingMsg = Array(50)
      .fill(0)
      .map((_, i) => ({
        id: 50 - i,
        userId: getRandomUserId(),
        timestamp: 1234567890123 + (50 - i) * 1000 * 60,
        text: `${50 - i} mock text`,
      }));

    setMsgs(settingMsg);
  }, []);

  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length} ${text}`,
    };
    msgs.unshift(newMsg);
  };

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem key={x.id} {...x} />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
