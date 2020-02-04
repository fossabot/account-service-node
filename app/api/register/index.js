import phone from "./phone";
import code from "./code";
import cpf from "./cpf";
import finish from "./finish";

export default function register({ post }) {
  post("/phone", phone);
  post("/code", code);
  post("/cpf", cpf);
  post("/finish", finish);

  // endpoint("/driver", driver)
}
