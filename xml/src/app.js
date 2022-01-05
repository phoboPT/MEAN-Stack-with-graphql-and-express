import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql/schema.js";
import graphqlResolver from "./graphql/resolvers.js";
import { migrationRouter } from "./routes/migration.js";
import { userRouter } from "./routes/users.js";
import cookieSession from "cookie-session";

const app = express();
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(migrationRouter);
app.use(userRouter);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.all("*", async (req, res) => {
  res.send("Index, /BAD_URL, route don't exist Auth");
});

export { app };
