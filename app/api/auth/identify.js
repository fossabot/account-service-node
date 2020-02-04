export default async function identifyUser({ busboy, body }, app) {
  await busboy.finish();

  if (!body.id) throw app.createError(400, "incomplete fields");

  const [user] = await app.models.users.get(body.id);

  if (!user) {
    throw app.createError(422, "user not found");
  }

  return {
    content: {
      fn: user.data.fn
    }
  };
}
