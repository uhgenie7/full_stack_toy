export enum METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export interface Message {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
}

export interface User {
  id: string;
  nickname: string;
}

export interface Users {
  [key: string]: User;
}

export interface IMutation {
  text: string;
  id?: string;
}

export type Mutate = ({ text, id }: { text: string; id?: string }) => void;

export interface MsgQueryData {
  pages: { messages: Message[] }[];
  pageParams: string;
}
