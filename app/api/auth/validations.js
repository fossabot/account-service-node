import app from "../../index";

import * as errors from "./errors";

export function id(value) {
  if (!app.validation.schemas.identification(value)) {
    throw app.validation.error(errors.identification.invalid);
  }
}

export function pw(value) {
  if (!value || value.length < 6) {
    throw app.validation.error(errors.password.invalid);
  }
}

export async function code(value) {
  if (!value || value.length !== 5) {
    throw app.validation.error(errors.code.invalid);
  }
}
