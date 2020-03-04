import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import app from "../../../index";
import * as errors from "./errors";

export function name(error) {
  return (value, lang) => {
    if (!app.utils.regex.name.test(value)) {
      throw app.validation.error(error(lang));
    }
  };
}

export function password(value, lang) {
  if (!value || value.length < 6) {
    throw app.validation.error(errors.password.invalid(lang));
  }
}

export const contact = {
  code(value, lang) {
    if (typeof value !== "undefined" && value.length !== 5) {
      throw app.validation.error(errors.contact.code.invalid(lang));
    }
  },
  item(value, lang) {
    if (value && !app.utils.regex.phone.test(value) && !isValidEmail(value)) {
      throw app.validation.error(errors.contact.item.invalid(lang));
    }
  }
};
