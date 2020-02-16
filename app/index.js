import "./enviroment";
import Univ from "@univ/setup";
import Fastify from "@univ/fastify";
import Express from "@univ/express";

import Redis from "ioredis";

import models from "./models";
import lib from "./lib";
import api from "./api";

const redis = new Redis({
  host: process.env.REDISHOST || "127.0.0.1",
  port: process.env.REDISPORT || 6379,
  keyPrefix: "accountService:",
  showFriendlyErrorStack: true
});

redis.on("connect", () => {
  (process.env.NODE_ENV === "production" || process.env.DEBUG) &&
    console.info("redis connected");
});

redis.on("end", err => {
  console.error(err);
  process.exit(-1);
});

const httpFrameworks = {
  fastify: Fastify,
  express: Express
};

const app = new Univ(httpFrameworks[process.env.HTTP_FRAMEWORK], {
  port: process.env.PORT || 3000
});

app.use(({ setHeaders, method }) => {
  setHeaders({
    "Access-Control-Allow-Origin": process.env.ORIGINS || "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization"
  });

  if (method === "OPTIONS") {
    return { code: 200 };
  }
});

app.setErrorTracker((err, { ip, ips, headers, params }) => {
  if (!(process.env.NODE_ENV === "production" || process.env.DEBUG)) return;

  return "statusCode" in err && !err.dangerous
    ? console.log(err)
    : console.error(err, "context", { ip, ips, headers, params });
});

app.attach("redis", redis);
app.attach("models", models);
lib(app);
api(app);

export default app;
