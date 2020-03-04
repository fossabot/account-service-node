import detectLang from "accept-language-parser";
import pt from "./locales/pt.json";
import en from "./locales/en.json";

export default function setupI18n(app) {
  const languages = { en, pt };

  app.use(ctx => {
    let [{ code = "en" } = {}] = detectLang(ctx.headers["accept-language"]);

    code = code === "*" ? "pt" : code;

    ctx.i18n = {
      language: code,
      message: id => languages[code][id]
    };
  });

  return { languages };
}
