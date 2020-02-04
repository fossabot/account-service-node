import identify from "./identify";
import sign from "./sign";
// const unsign = require("./unsign");

export default function loginSetup({ post }) {
  post("/identify", identify);
  post("/sign", sign);
  // endpoint.post("/unsign", unsign);
}
