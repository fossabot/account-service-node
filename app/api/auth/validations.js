import app from "../../index";

import { identification, password, code as codeError } from "./errors";

export function id(value) {
  if (!app.validation.schemas.identification(value)) {
    throw app.createError(
      identification.invalid.statusCode,
      identification.invalid.message,
      {
        code: identification.invalid.code
      }
    );
  }
}

export function pw(value) {
  if (!value || value.length < 6) {
    throw app.createError(
      password.invalid.statusCode,
      password.invalid.message,
      {
        code: password.invalid.code
      }
    );
  }
}

export async function code(value) {
  if (!value || value.length !== 5) {
    throw app.createError(
      codeError.invalid.statusCode,
      codeError.invalid.message,
      {
        code: codeError.invalid.code
      }
    );
  }
}
