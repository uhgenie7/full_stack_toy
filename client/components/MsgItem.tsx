import React from "react";
import MsgInput from "./MsgInput";

const MsgItem = ({
  id,
  userId,
  timestamp,
  text, // 여기까지 기존 객체
  onUpdate,
  isEditing,
  startEdit,
  onDelete,
  myId,
  user,
}) => (
  <ul className="messages__item">
    <h3>
      {user?.nickname}
      <sub>
        {new Date(timestamp).toLocaleString("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </sub>
    </h3>
    {isEditing ? (
      <>
        <MsgInput mutate={onUpdate} id={id} text={text} />
      </>
    ) : (
      text
    )}
    {myId === userId && (
      <div className="messages__buttons">
        <button onClick={startEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    )}
  </ul>
);

export default MsgItem;
