export default async function identifyUser({ busboy, body }, app) {
  await busboy.finish();

  if (!body.id || body.id.length > 30) throw app.createError(400);

  const { data } = await app.models.users.get(body.id);

  if (!data) {
    return { content: { user: null } };
  }

  const user = {
    fn: data.fn,
    photo: data.photo
  };

  return {
    content: {
      user,
      next: "credential"
    }
  };
}
