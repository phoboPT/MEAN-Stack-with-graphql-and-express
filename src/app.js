import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql/schema.js";
import graphqlResolver from "./graphql/resolvers.js";
import { indexRouter } from "./routes/index.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(indexRouter);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

export { app };
