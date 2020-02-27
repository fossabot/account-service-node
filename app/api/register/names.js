import { username, fn, ln } from "./validations";

export default async function names({ body }, { validation }) {
  await validation(body, {
    username,
    fn,
    ln
  });

  return { code: 200 };
}
