export default async function catchUserData(ctx, app) {
  const query = await app.models.users.getById(ctx.userId);

  const user = {
    data: query.data,
    async update(data) {
      await app.models.users.set(query.id, data);
      return Object.assign(user.data, data);
    }
  };

  ctx.attach("user", user);
}
