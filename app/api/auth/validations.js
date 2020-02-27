import { invalidId, invalidPassword, invalidCode } from "./errors";

export function id(value) {
  if (!value || value.length < 3 || value.length > 20) {
    throw invalidId();
  }
}

export function pw(value) {
  console.log("validate pw", value);
  if (!value || value.length < 6) {
    throw invalidPassword();
  }
}

export async function code(value) {
  if (!value || value.length !== 5) {
    throw invalidCode();
  }
}
