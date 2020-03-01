import { id } from "./validations";
import { user } from "./errors";

export default async function identifyUser(ctx, app) {
  await app.validation.validate(ctx.params, { id });

  const userQuery = await app.models.users.get(ctx.params.id);

  if (!userQuery) {
    throw app.createError(user.notFound.code, user.notFound.message);
  }

  return {
    body: {
      fn: userQuery.fn,
      photo: userQuery.photo
    }
  };
}
