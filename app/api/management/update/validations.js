import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import app from "../../../index";
import * as errors from "./errors";

export function name(error) {
  return value => {
    if (!app.utils.regex.name.test(value)) {
      throw app.validation.error(error);
    }
  };
}

export function password(value) {
  if (!value || value.length < 6) {
    throw app.validation.error(errors.password.invalid);
  }
}

export const contact = {
  code(value) {
    if (typeof value !== "undefined" && value.length !== 5) {
      throw app.validation.error(errors.contact.code.invalid);
    }
  },
  item(value) {
    if (value && !app.utils.regex.phone.test(value) && !isValidEmail(value)) {
      throw app.validation.error(errors.contact.item.invalid);
    }
  }
};
