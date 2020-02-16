import identify from "./identify";
import credential from "./credential";
import code from "./code";
// const unsign = require("./unsign");

export default function loginSetup({ post }) {
  post("/identify", identify);
  post("/credential", credential);
  post("/code", code);
  // endpoint.post("/unsign", unsign);
}
