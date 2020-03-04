import { isValidEmail, isValidCPF } from "@brazilian-utils/brazilian-utils";
import utils from "./utils";

const schemas = {
  identification: id =>
    utils.regex.phone.test(id) ||
    utils.regex.username.test(id) ||
    isValidEmail(id) ||
    isValidCPF(id)
};

export default function validator(app) {
  return { validate, error, schemas };

  async function validate(content, validations, lang) {
    for (const field in validations) {
      await validations[field](content[field], lang);
    }
  }

  function error(error) {
    return app.createError(error.statusCode, error.message, {
      code: error.code
    });
  }
}
