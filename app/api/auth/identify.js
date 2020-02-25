export default async function identifyUser({ busboy, body }, app) {
  await busboy.finish();

  if (!body.id || body.id.length > 20) throw app.createError(400);

  const user = await app.models.users.get(body.id);

  if (!user) {
    return { content: { user: null } };
  }

  return {
    content: {
      user: {
        fn: user.fn,
        photo: user.photo
      },
      next: "credential"
    }
  };
}
