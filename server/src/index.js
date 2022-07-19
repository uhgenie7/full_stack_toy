import express from "express";
import { ApolloServer } from "apollo-server-express";
// import cors from "cors";
import messagesRoute from "./routes/messages.js";
import usersRoute from "./routes/users.js";

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    // 참조할 데이터
    moddels: {
      messages: "",
      users: "",
    },
  },
});

const app = express();
await server.start();
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: "http://localhost:3000", credentials: true },
});

await app.listen({ port: 8000 });
console.log("server listen");
