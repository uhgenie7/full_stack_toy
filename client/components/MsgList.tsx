import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQueryClient, useMutation, useQuery } from "react-query";
import MsgInput from "./MsgInput";
import MsgItem from "./MsgItem";
import { fetcher, QueryKeys } from "../queryClient";
import {
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  GET_MESSAGES,
  DELETE_MESSAGE,
} from "../graphql/message";

interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

const MsgList = ({ smsgs, users }) => {
  const client = useQueryClient();
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const UserIds = ["roy", "jay"];
  const [msgs, setMsgs] = useState<Message[]>(smsgs);
  const [editingId, setEditingId] = useState(null);

  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            messages: [createMessage, ...old.messages],
          };
        });
      },
    }
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === updateMessage.id
          );
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1, updateMessage);
          return { messages: newMsgs };
        });
        doneEdit();
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
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

  const { data, error, isError } = useInfiniteQuery(QueryKeys.MESSAGES, () =>
    fetcher(GET_MESSAGES)
  );

  useEffect(() => {
    if (!data?.messages) return;
    console.log("msgs changed");
    setMsgs(data.messages);
  }, [data?.messages]);

  if (isError) {
    console.error(error);
    return null;
  }

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
            user={users.find((x) => userId === x.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
