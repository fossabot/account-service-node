import app from "../../index";
import { isValidCPF } from "@brazilian-utils/brazilian-utils";

export default async function registerRequestValidator(body, fields) {
  const response = {};

  if (
    fields.phone &&
    (!body.nbr || !body.ncode || !app.utils.regex.phone.test(body.nbr))
  ) {
    throw app.createError(400, "invalid number");
  }

  if (fields.code) {
    if (!body.code) throw app.createError(400, "invalid code");

    const codeData = await app.cache.get("verificationCode", body.nbr);

    response.codeData = codeData;

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

  if (
    fields.birth &&
    (!body.birth || !/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(body.birth))
  ) {
    throw app.createError(400, "invalid birth");
  }

  if (fields.pw && (!body.pw || body.pw.length <= 5)) {
    throw app.createError(400, "invalid password");
  }

  if (fields.username) {
    if (!body.username || !app.utils.regex.username.test(body.username))
      throw app.createError(400, "invalid username");

    const user = await app.models.users.getByUsername(body.username);

    if (user.data) {
      return {
        ...response,
        response: {
          content: { message: "in use" }
        }
      };
    }
  }

  if (fields.name) {
    if (!body.fn || !app.utils.regex.name.test(body.fn))
      throw app.createError(400, "invalid name");
  }

  if (fields.name && (!body.ln || !app.utils.regex.name.test(body.ln))) {
    throw app.createError(400, "invalid last name");
  }

  return response;
}
