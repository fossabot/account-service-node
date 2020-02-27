import { compare, hash } from "bcrypt";

export default async function updatePassword({ body, user }, app) {
  const { current, want } = body;

  if (!current || !want || current.length <= 5 || want.length <= 5) {
    throw app.createError(400);
  }

  if (!(await compare(current, user.data.pw)))
    throw app.createError(406, "invalid password");

  await user.update({ pw: await hash(want, 10) });

  return { code: 201, content: { message: "ok" } };
}
