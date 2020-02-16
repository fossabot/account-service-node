import register from "./register";
import auth from "./auth";
import management from "./management";

export default function setupApi({ endpoint }) {
  endpoint("/register", register);
  endpoint("/auth", auth);
  endpoint("/account", management);
}
