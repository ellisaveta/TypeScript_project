import { knex } from "knex";
import knexConfig from "../knexfile";
import { Model } from "objection";
import express, { json } from "express";
import { movieRouter } from "./routers/movies";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/users";
import { config } from "./config";
import { commentRouter } from "./routers/comments";
import { reviewRouter } from "./routers/review";
import cors from "cors";
import { actorRouter } from "./routers/actors";

const knexClient = knex(knexConfig.development);
Model.knex(knexClient);

const app = express();
const port = config.get("port");

app.use(cors());

app.use((req, res, next) => {
  console.log("Request received", {
    path: req.path,
    method: req.method,
    params: req.params,
    body: req.body,
    query: req.query,
  });

  next();
});

app.use(json());

app.use("/movies", movieRouter);

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/comments", commentRouter);

app.use("/reviews", reviewRouter);

app.use("/actors", actorRouter);

app.listen(port);

console.log("Server started on port", port);
