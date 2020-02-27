export default async function updateProfile(ctx, app) {
  const { body, user } = ctx;

  const { fn, ln } = body;

  if (
    (!fn && !ln) ||
    !app.utils.regex.name.test(fn) ||
    !app.utils.regex.name.test(ln)
  ) {
    throw app.createError(400, "invalid names");
  }

  const data = {};

  if (fn) {
    data.fn = fn;
  }

  if (ln) {
    data.ln = ln;
  }

  await user.update(data);

  return { code: 201, content: { message: "ok" } };
}
