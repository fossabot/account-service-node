import app from "../../index";
import { isValidCPF } from "@brazilian-utils/brazilian-utils";

export default async function registerRequestValidator(body, fields) {
  let codeData;

  if (fields.phone && (!body.nbr || !app.utils.regex.phone.test(body.nbr))) {
    throw app.createError(400, "invalid number");
  }

  if (fields.code) {
    if (!body.code) throw app.createError(400, "invalid code");

    codeData = await app.cache.get("verificationCode", body.nbr);

    if (
      !codeData ||
      (fields.code === "confirmed" &&
        (!codeData.confirmed || codeData.code !== body.code))
    ) {
      throw app.createError(400, "invalid code");
    }
  }

  if (fields.cpf && !isValidCPF(body.cpf)) {
    throw app.createError(400, "invalid cpf");
  }

  if (fields.pw && (!body.pw || body.pw.length <= 5)) {
    throw app.createError(400, "invalid password");
  }

  return codeData;
}
