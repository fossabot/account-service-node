import app from "../../index";
import { isValidEmail, isValidCPF } from "@brazilian-utils/brazilian-utils";
import * as error from "./errors";

export default async function registerRequestValidator(body, fields) {
  const response = {};

  if (
    fields.id &&
    ((!body.email && !body.nbr) ||
      (body.email && !isValidEmail(body.email)) ||
      (body.nbr && (!body.ncode || !app.utils.regex.phone.test(body.nbr))))
  ) {
    throw app.createError(422, "Invalid identification", { code: 0 });
  }

  response.idBy = body.email ? "email" : "phone";

  if (fields.phone) {
    if (!body.ncode) {
      throw error.countryCode.invalid(); // app.createError(422, "Invalid country code", { code: 0 });
    }

    if (!body.nbr || !app.utils.regex.phone.test(body.nbr)) {
      throw error.phone.invalid(); // app.createError(422, "Invalid number", { code: 1 });
    }

    const user = await app.models.users.getByPhone(body.nbr);
    // const user = await app.models.users.get(id);
    if (user) {
      throw error.phone.inUse(); // app.createError(422, "Number in use", { code: 2 });
    }
  }

  if (fields.code) {
    if (!body.code || body.code.length !== 5) {
      throw error.code.invalid(); // app.createError(422, "Invalid code", { code: 3 });
    }

    if (
      !(await app.verification.check(
        `+${body.ncode}${body.nbr}`,
        body.code,
        fields.code === "confirmed"
      ))
    )
      throw error.code.wrong(); // app.createError(422, "Wrong code", { code: 4 });
  }

  if (fields.cpf && !isValidCPF(body.cpf)) {
    throw error.cpf.invalid(); // app.createError(422, "Invalid cpf", { code: 5 });
  }

  if (
    fields.birth &&
    (!body.birth || !/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(body.birth))
  ) {
    throw error.birth.invalid(); // app.createError(422, "Invalid birth", { code: 6 });
  }

  if (fields.pw && (!body.pw || body.pw.length <= 5)) {
    throw error.password.invalid(); // app.createError(422, "Invalid password", { code: 7 });
  }

  if (fields.username) {
    if (!body.username || !app.utils.regex.username.test(body.username))
      throw error.username.invalid(); // app.createError(422, "Invalid username", { code: 8 });

    const user = await app.models.users.getByUsername(body.username);

    if (user) {
      throw error.username.inUse(); // app.createError(422, "Username in use", { code: 9 });
    }
  }

  if (fields.name) {
    if (!body.fn || !app.utils.regex.name.test(body.fn))
      throw error.firstName.invalid(); // app.createError(422, "Invalid first name", { code: 10 });
  }

  if (fields.name && (!body.ln || !app.utils.regex.name.test(body.ln))) {
    throw error.lastName.invalid(); // app.createError(422, "Invalid last name", { code: 11 });
  }

  return response;
}
