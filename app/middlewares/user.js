export default async function catchUserData(ctx, app) {
  const data = await app.data.users.get(ctx.userId);

  ctx.user = {
    data,
    async update(newData) {
      await app.data.users.set(data.id, newData);
      return Object.assign(ctx.user.data, newData);
    }
  };
}
