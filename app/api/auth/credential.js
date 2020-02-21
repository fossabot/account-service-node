import { compare } from "bcrypt";
import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default async function credential(ctx, app) {
  const { busboy, body } = ctx;
  await busboy.finish();

  if (!body.id || body.id.length > 30 || !body.pw) throw app.createError(400);

  const { id: uid, data } = await app.models.users.get(body.id);
  if (!data) {
    return { content: { user: null } };
  }

  const pwMatch = await compare(body.pw, data.pw);

  if (!pwMatch) {
    throw app.createError(401, "wrong credentials");
  }

  const secondFactor = data.authSecondFactor;

  if (secondFactor !== false) {
    await app.verification.create(secondFactor, body.renew);
    const content = { next: "code" };

    if (isValidEmail(secondFactor) && body.id !== secondFactor) {
      // mask email@provider.com -> ema**@provider.com
      const parts = secondFactor.split("@");
      content.target = `${parts[0].slice(0, 3).padEnd(parts[0].length, "*")}@${
        parts[1]
      }`;
    } else {
      // last 4 celphone digits
      content.target = secondFactor.slice(
        secondFactor.length - 4,
        secondFactor.length
      );
    }

    return { content };
  }

  const { token } = await app.sessions.create(uid, ctx);

  return {
    code: 201,
    content: {
      id: uid,
      token
    }
  };
}
