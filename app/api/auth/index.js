import identify from "./identify";
import credential from "./credential";
import code from "./code";
import unsign from "./unsign";

export default function loginSetup({ post, endpoint }) {
  post("/identify", identify);
  post("/credential", credential);
  post("/code", code);
  endpoint("/unsign", unsign);
}
