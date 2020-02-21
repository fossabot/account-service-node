export default async function code(ctx, app) {
  const { busboy, body } = ctx;
  await busboy.finish();

  const { id, code } = body;

  if (!id || !code || code.length !== 5) throw app.createError(400);

  let key = id;

  if (app.utils.regex.phone.test(id)) {
    const { data } = await app.models.users.getByPhone(id);
    if (data) key = `+${data.ncode}${id}`;
  }

  if (!(await app.verification.confirm(key, code))) throw app.createError(406);

  const { token } = await app.sessions.create(id, ctx);

  app.verification
    .remove(key)
    .catch(e =>
      console.error("Delete verification authentication code, err:", e)
    );

  return {
    content: { message: "ok", token }
  };
}
