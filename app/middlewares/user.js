export default async function catchUserData(ctx, app) {
  const data = await app.data.users.get(ctx.userId);

  const user = {
    data,
    async update(newData) {
      await app.data.users.set(data.id, newData);
      return Object.assign(user.data, newData);
    }
  };

  ctx.attach("user", user);
}
