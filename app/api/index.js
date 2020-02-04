// import account from "./account";
import register from "./register";
import auth from "./auth";
// import recover from "./recover";
import management from "./management";

export default function setupApi({ endpoint }) {
  // endpoint("/account", account);
  endpoint("/register", register);
  endpoint("/auth", auth);
  // endpoint("/recover", recover);
  // management(endpoint);
  endpoint("/account", management);
}
