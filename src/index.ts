import express from "express";
import {
  Request,
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { contextFactory } from "./context";
import { schema } from "./schema";
import mongoose from "mongoose";

async function main() {
  const app = express();
  app.use(express.json());

  mongoose.connect(process.env.MONGODB_URI!);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });

  app.use("/graphql", async (req, reply) => {
    const request: Request = {
      headers: req.headers,
      method: req.method,
      query: req.query,
      body: req.body,
    };

    if (shouldRenderGraphiQL(request)) {
      reply.header("Content-Type", "text/html");
      reply.send(
        renderGraphiQL({
          endpoint: "/graphql",
        })
      );
      return;
    }

    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      request,
      schema,
      operationName,
      contextFactory: () => contextFactory(req),
      query,
      variables,
    });

    sendResult(result, reply);
  });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`GraphQL server is running on port ${port}.`);
  });
}

main();
