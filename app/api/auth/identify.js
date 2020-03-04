import { id } from "./validations";
import { user } from "./errors";

const validations = { id };

export default async function identifyUser(ctx, app) {
  await app.validation.validate(ctx.params, validations, ctx.language);

  const userQuery = await app.models.users.get(ctx.params.id);

  if (!userQuery) {
    throw app.validation.error(user.notFound(ctx.language));
  }

  return {
    body: {
      fn: userQuery.fn,
      photo: userQuery.photo
    }
  };
}
