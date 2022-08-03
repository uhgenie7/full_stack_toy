import { MsgQueryData, Message } from "../../types";

export const getNewMessages = (old: MsgQueryData) => ({
  pageParams: old.pageParams,
  pages: old.pages.map(({ messages }) => ({ messages: [...messages] })),
});

export const findTargetMsgIndex = (
  pages: { messages: Message[] }[],
  id: string
) => {
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
