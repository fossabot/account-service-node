import app from "../../index";
import * as errors from "./errors";
import { isValidCPF } from "@brazilian-utils/brazilian-utils";

export function ncode(value, lang) {
  if (!value || value.length !== 2 || isNaN(value)) {
    throw app.validation.error(errors.countryCode.invalid(lang));
  }
}

export async function phone(value, lang) {
  if (!value || !app.utils.regex.phone.test(value)) {
    throw app.validation.error(errors.phone.invalid(lang));
  }

  const user = await app.models.users.getByPhone(value);

  if (user) {
    throw app.validation.error(errors.phone.inUse(lang));
  }
}

export async function code(code, lang) {
  if (!code || code.length !== 5) {
    throw app.validation.error(errors.code.invalid(lang));
  }
}

export async function cpf(value, lang) {
  if (!isValidCPF(value)) {
    throw app.validation.error(errors.cpf.invalid(lang));
  }

  if (await app.models.users.getByCPF(value)) {
    throw app.validation.error(errors.cpf.inUse(lang));
  }
}

export async function birth(value, lang) {
  if (!value || !/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/.test(value)) {
    throw app.validation.error(errors.birth.invalid(lang));
  }
}

export async function pw(value, lang) {
  if (!value || value.length <= 5) {
    throw app.validation.error(errors.password.invalid(lang));
  }
}

export async function username(value, lang) {
  if (!value || !app.utils.regex.username.test(value)) {
    throw app.validation.error(errors.username.invalid(lang));
  }

  if (await app.models.users.getByUsername(value)) {
    throw app.validation.error(errors.username.inUse(lang));
  }
}

export async function fn(value, lang) {
  if (!value || !app.utils.regex.name.test(value)) {
    throw app.validation.error(errors.firstName.invalid(lang));
  }
}

export async function ln(value, lang) {
  if (!value || !app.utils.regex.name.test(value)) {
    throw app.validation.error(errors.lastName.invalid(lang));
  }
}
