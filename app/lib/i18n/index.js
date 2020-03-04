import { parse } from "accept-language-parser";
import { pt, en } from "./languages";

export default function setupI18n(app) {
  const languages = { en, pt };

  app.use(ctx => {
    let [{ code = "en" } = {}] = parse(ctx.headers["accept-language"]);

    code = code === "*" ? "pt" : code;

    ctx.language = code;
    ctx.message = id => languages[code][id];
  });

  return { languages };
}
