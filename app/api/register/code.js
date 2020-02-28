import { code } from "./validations";

export default async function codeController(ctx, app) {
  await app.validation.validate(ctx.body, { code });

  return {
    code: 200
  };
}
