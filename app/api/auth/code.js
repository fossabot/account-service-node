export default async function code(ctx, app) {
  const { busboy, body } = ctx;
  await busboy.finish();

  const { id, code } = body;

  if (!id || !code || code.length !== 5) throw app.createError(400);

  if (!(await app.verification.confirm(id, code))) throw app.createError(406);

  const { token } = await app.sessions.create(id, ctx);

  app.verification
    .remove(id)
    .catch(e =>
      console.error("Delete verification authentication code, err:", e)
    );

  return {
    content: { message: "ok", token }
  };
}
