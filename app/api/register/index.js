import phone from "./phone";
import code from "./code";
import cpf from "./cpf";
import names from "./names";
import finish from "./finish";

export default function register({ post }) {
  post("/phone", phone);
  post("/code", code);
  post("/cpf", cpf);
  post("/names", names);
  post("/finish", finish);

  // endpoint("/driver", driver)
}
