import models from "./models";
import redis from "./redis";
import utils from "./utils";
import cache from "./cache";
import data from "./data";
import jwt from "./jwt";
import sessions from "./sessions";
import sms from "./sms";
import verification from "./verification";
import storage from "./storage";
import email from "./email";
import validation from "./validation";
import i18n from "./i18n";

export default function attachLibrary(app) {
  app.attach("models", models);
  app.attach("redis", redis);

  app.attach("utils", utils);
  app.attach("cache", cache(app.redis));
  app.attach("data", data);
  app.attach("jwt", jwt);
  app.attach("sessions", sessions);
  app.attach("sms", sms);
  app.attach("verification", verification);
  app.attach("storage", storage);
  app.attach("email", email);
  app.attach("validation", validation);
  app.attach("i18n", i18n);
}
