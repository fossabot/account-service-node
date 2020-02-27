import { userNotFound } from "./errors";
import { id } from "./validations";

export default async function identifyUser({ params }, app) {
  await app.validation(params, { id });

  const user = await app.models.users.get(params.id);

  if (!user) {
    throw userNotFound();
  }

  return {
    content: {
      user: {
        fn: user.fn,
        photo: user.photo
      }
    }
  };
}
