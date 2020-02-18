export default async function updateProfile({ busboy, body, user }, app) {
  await busboy.finish();

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

  return { content: { message: "ok" } };
}
