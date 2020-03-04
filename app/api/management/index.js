// middlewares
import createAuthMiddleware from "../../middlewares/auth";
import userMiddleware from "../../middlewares/user";

// catch data
import getAction from "./get";

// update
import profile from "./update/profile";
import password from "./update/password";
import authMode from "./update/auth-mode";
import photo from "./update/photo";
import contact from "./update/contact";

export default function management({ use, get, put }, app) {
  use(createAuthMiddleware());
  use(userMiddleware);

  get("/", getAction);

  put("/profile", profile);
  put("/password", password);
  put("/auth", authMode);
  put("/photo", photo(app));
  put("/contact", contact(app));
  // get("/history/:page", history)
}
