import { readDB, writeDB } from "../dbController.js";
import { v4 } from "uuid";
const getMsgs = readDB("messages");
const setMsgs = (data) => writeDB("messages", data);

const messagesRoute = [
  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: (req, res) => {
      const msgs = getMsgs;
      res.send(msgs);
    },
  },
  {
    // CREATE MESSAGE
    method: "post",
    route: "/messages",
    handler: ({ body, params, query }, res) => {
      const msgs = getMsgs;
      const newMsgs = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now(),
      };
      msgs.unshift(newMsg);
      setMsgs(msgs);
      res.send();
    },
  },
  {
    // UPDATE MESSAGE
    method: "put",
    route: "/messages/:id",
    handler: (req, res) => {
      const msgs = getMsgs;
      res.send();
    },
  },
  {
    // DELETE MESSAGE
    method: "delete",
    route: "/messages/:id",
    handler: (req, res) => {
      const msgs = getMsgs;
      res.send();
    },
  },
];

export default messagesRoute;
