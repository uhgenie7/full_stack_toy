import { readDB, writeDB } from "../dbController.js";
const getMsgs = readDB("messages");

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
    // GET MESSAGE
    method: "get",
    route: "/messages/:id",
    handler: (req, res) => {
      res.send();
    },
  },
  {
    // CREATE MESSAGE
    method: "post",
    route: "/messages",
    handler: ({ body, params, query }, res) => {
      res.send();
    },
  },
  {
    // UPDATE MESSAGE
    method: "put",
    route: "/messages/:id",
    handler: (req, res) => {
      res.send();
    },
  },
  {
    // DELETE MESSAGE
    method: "delete",
    route: "/messages/:id",
    handler: (req, res) => {
      res.send();
    },
  },
];

export default messagesRoute;
