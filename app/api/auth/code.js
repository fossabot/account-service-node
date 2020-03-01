import { id, code as codeError } from "./validations";
import { code } from "./errors";

export default async function codeController(ctx, app) {
  await app.validation.validate(ctx.body, { id, code: codeError });

  const { id: uid, code: sentCode } = ctx.body;

  if (!(await app.verification.check(uid, sentCode))) {
    throw app.createError(code.wrong.statusCode, code.wrong.message, {
      code: code.wrong.code
    });
  }

  const { token: content } = await app.sessions.create(uid, ctx);

  app.verification
    .remove(uid)
    .catch(e =>
      console.error("Delete verification authentication code, err:", e)
    );

  return {
    code: 201,
    body: { content }
  };
}
