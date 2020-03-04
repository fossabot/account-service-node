import app from "../../index";

import * as errors from "./errors";

export function id(value, lang) {
  if (!app.validation.schemas.identification(value)) {
    throw app.validation.error(errors.identification.invalid(lang));
  }
}

export function pw(value, lang) {
  if (!value || value.length < 6) {
    throw app.validation.error(errors.password.invalid(lang));
  }
}

export async function code(value, lang) {
  if (!value || value.length !== 5) {
    throw app.validation.error(errors.code.invalid(lang));
  }
}
