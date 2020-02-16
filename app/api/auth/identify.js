export default async function identifyUser({ busboy, body }, app) {
  await busboy.finish();

  if (!body.nbr || !app.utils.regex.phone.test(body.nbr))
    throw app.createError(400, "incomplete fields");

  const user = await app.models.users.getByPhone(body.nbr);

  if (!user.data) {
    return { content: { user: null } };
  }

  return {
    content: {
      user: {
        fn: user.data.fn,
        photo: user.data.photo
      }
    }
  };
}
