import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";

const MsgList = ({ msgs, users, onCreate, onUpdate, onDelete }) => {
  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            user={users[x.userId]}
            {...x}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
