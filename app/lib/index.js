import utils from "./utils";
import cache from "./cache";
import data from "./data";
import jwt from "./jwt";
import sessions from "./sessions";
import sms from "./sms";
import verification from "./verification";
import storage from "./storage";

export default function attachLibrary(app) {
  app.attach("utils", utils);
  app.attach("cache", cache(app.redis));
  app.attach("data", data);
  app.attach("jwt", jwt);
  app.attach("sessions", sessions);
  app.attach("sms", sms);
  app.attach("verification", verification);
  app.attach("storage", storage);
}
