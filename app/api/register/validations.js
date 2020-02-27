import app from "../../index";
import * as error from "./errors";
import { isValidCPF } from "@brazilian-utils/brazilian-utils";

export async function ncode(value) {
  if (!value || value.length !== 2 || isNaN(value)) {
    throw app.createError(422, error.countryCode.invalid.message, {
      code: error.countryCode.invalid.code
    });
  }
}

export async function phone(value) {
  if (!value || !app.utils.regex.phone.test(value)) {
    throw app.createError(422, error.phone.invalid.message, {
      code: error.phone.invalid.code
    });
  }

  const user = await app.models.users.getByPhone(value);

  if (user) {
    throw app.createError(422, error.phone.inUse.message, {
      code: error.phone.inUse.code
    });
  }
}

export async function code(code, { phone }) {
  console.log("@code", code);
  if (!code || code.length !== 5) {
    throw app.createError(422, error.code.invalid.message, {
      code: error.code.invalid.code
    });
  }

  if (!(await app.verification.check(`reg:${phone}`, code))) {
    throw app.createError(422, error.code.wrong.message, {
      code: error.code.wrong.code
    });
  }
}

export async function cpf(value) {
  if (!isValidCPF(value)) {
    throw app.createError(422, error.cpf.invalid.message, {
      code: error.cpf.invalid.code
    });
  }

  const user = await app.models.users.getByCPF(value);

  console.log("@user", value, user);

  if (user) {
    throw app.createError(422, error.cpf.inUse.message, {
      code: error.cpf.inUse.code
    });
  }
}

export async function birth(value) {
  if (!value || !/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(value)) {
    throw app.createError(422, error.birth.invalid.message, {
      code: error.birth.invalid.code
    });
  }
}

export async function pw(value) {
  if (!value || value.length <= 5) {
    throw app.createError(422, error.password.invalid.message, {
      code: error.password.invalid.code
    });
  }
}

export async function username(value) {
  if (!value || !app.utils.regex.username.test(value)) {
    throw app.createError(422, error.username.invalid.message, {
      code: error.username.invalid.code
    });
  }

  if (await app.models.users.getByUsername(value)) {
    throw app.createError(422, error.username.inUse.message, {
      code: error.username.inUse.code
    });
  }
}

export async function fn(value) {
  if (!value || !app.utils.regex.name.test(value)) {
    throw app.createError(422, error.firstName.invalid.message, {
      code: error.firstName.invalid.code
    });
  }
}

export async function ln(value) {
  if (!value || !app.utils.regex.name.test(value)) {
    throw app.createError(422, error.lastName.invalid.message, {
      code: error.lastName.invalid.code
    });
  }
}
