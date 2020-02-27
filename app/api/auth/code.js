import { id, code } from "./validations";
import { wrongCode } from "./errors";

export default async function codeController(ctx, app) {
  const { busboy, body } = ctx;
  await busboy.finish();
  await app.validation(body, { id, code });

  const { id: uid, code: sentCode } = body;

  if (!(await app.verification.check(uid, sentCode))) {
    throw wrongCode();
  }

  const { token: content } = await app.sessions.create(uid, ctx);

  app.verification
    .remove(uid)
    .catch(e =>
      console.error("Delete verification authentication code, err:", e)
    );

  return {
    code: 201,
    content: { content }
  };
}
