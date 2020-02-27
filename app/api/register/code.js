import { code } from "./validations";

export default async function codeController({ body }, { validation }) {
  await validation(body, { code });

  return {
    code: 200
  };
}
