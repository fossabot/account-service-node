import { isValidEmail, isValidCPF } from "@brazilian-utils/brazilian-utils";

export default function validator(app) {
  const schemas = {
    identification: id =>
      app.utils.regex.phone.test(id) ||
      app.utils.regex.username.test(id) ||
      isValidEmail(id) ||
      isValidCPF(id)
  };

  async function validate(content, validations) {
    for (const field in validations) {
      await validations[field](content[field], content);
    }
  }

  return { validate, schemas };
}
