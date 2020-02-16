import data from "./data";
import cache from "./cache";
import jwt from "./jwt";
import utils from "./utils";
import sms from "./sms";
import storage from "./storage";

export default function attachLibrary(app) {
  app.attach("cache", cache(app.redis));
  app.attach("data", data);
  app.attach("jwt", jwt);
  app.attach("utils", utils);
  app.attach("sms", sms);
  app.attach("storage", storage);
}
