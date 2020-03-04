import "./enviroment";
import Univ from "@univ/setup";
import Fastify from "@univ/fastify";
import Express from "@univ/express";

import lib from "./lib";
import api from "./api";

const httpFrameworks = {
  fastify: Fastify,
  express: Express
};

const app = new Univ(httpFrameworks[process.env.HTTP_FRAMEWORK], {
  port: process.env.PORT || 3000
  /*
  cors: {
    origin: process.env.ORIGINS || "*",
    methods: ["get", "put", "post", "delete", "options"],
    headers: ["content-type", "accept-langauge"]
  }
  */
});

app.attach("isProduction", process.env.NODE_ENV === "production");
app.attach("isDev", process.env.NODE_ENV === "development");

app.use(ctx => {
  ctx.setHeaders({
    "Access-Control-Allow-Origin": process.env.ORIGINS || "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Authorization, Content-Type, Accept-Language"
  });

  if (ctx.method === "OPTIONS") {
    return true;
  }
});

app.setErrorTracker(err => {
  if (!(process.env.NODE_ENV === "production" || process.env.DEBUG)) return;

  if (err.statusCode === 422) {
    return console.log(err);
  }

  console.error(err);
});

lib(app);
api(app);

export default app;
