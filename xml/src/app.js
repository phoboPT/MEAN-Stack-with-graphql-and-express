import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql/schema.js";
import graphqlResolver from "./graphql/resolvers.js";
import { migrationRouter } from "./routes/migration.js";
import { userRouter } from "./routes/users.js";
import { outletRouter } from "./routes/outlets.js";
import { productRouter } from "./routes/products.js";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.set("trust proxy", true);
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

router.use(migrationRouter);
router.use(userRouter);
router.use(outletRouter);
router.use(productRouter);

app.use("/api/", router);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.all("*", async (req, res) => {
  res.send("Index, /BAD_URL, route don't exist in Auth");
});

export { app };
