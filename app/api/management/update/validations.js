import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import app from "../../../index";
import { names, password as pwError, contact as contactError } from "./errors";

export function name(value) {
  if (!app.utils.regex.name.test(value)) {
    throw app.createError(names.invalid.statusCode, names.invalid.message, {
      code: names.invalid.code
    });
  }
}

export function password(value) {
  if (!value || value.length < 6) {
    throw app.createError(pwError.invalid.statusCode, pwError.invalid.message, {
      code: pwError.invalid.code
    });
  }
}

export const contact = {
  code(value) {
    if (typeof value !== "undefined" && value.length !== 5) {
      throw app.createError(
        contactError.code.invalid.statusCode,
        contactError.code.invalid.message,
        {
          code: contactError.code.invalid.code
        }
      );
    }
  },
  item(value) {
    if (value && isInvalid(value)) {
      throw app.createError(
        contactError.item.invalid.statusCode,
        contactError.item.invalid.message,
        {
          code: contactError.item.invalid.code
        }
      );
    }
  }
};

function isInvalid(field) {
  return !app.utils.regex.phone.test(field) && !isValidEmail(field);
}
