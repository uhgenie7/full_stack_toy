import MsgItem from "./MsgItem";

const UserIds = ["roy", "jay"];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

const msgs = [
  {
    id: 1,
    userId: getRandomUserId(),
    timestamp: 1234567890123,
    text: "1 mock text",
  },
];

const MsgList = () => (
  <ul className="messages">
    {[].map((x) => (
      <MsgItem {...x} />
    ))}
  </ul>
);

export default MsgList;
