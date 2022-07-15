const messagesRoute = [
  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: (req, res) => {
      res.send();
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
    handler: (req, res) => {
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
