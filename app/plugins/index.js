import cache from "./cache";
import jwt from "./jwt";
import utils from "./utils";
import sms from "./sms";

export default function setupPlugins(app) {
  app.attach("cache", cache(app.redis));
  app.attach("jwt", jwt);
  app.attach("utils", utils);
  app.attach("sms", sms);
}
