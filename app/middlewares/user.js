export default async function catchUserData(
  { userId, attach },
  { data: appData, models: { users } }
) {
  const data = await appData.users.get(userId);

  const user = {
    data,
    async update(newData) {
      await appData.users.set(data.id, newData);
      return Object.assign(user.data, newData);
    }
  };

  attach("user", user);
}
