import { compare } from "bcrypt";
import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default async function credential(ctx, app) {
  const { busboy, body } = ctx;
  await busboy.finish();

  if (!body.id || body.id.length > 30 || !body.pw) throw app.createError(400);

  const user = await app.models.users.get(body.id);
  if (!user) {
    return { content: { user: null } };
  }

  if (!(await compare(body.pw, user.pw))) {
    throw app.createError(401, "wrong credentials");
  }

  const secondFactor = user.authSecondFactor;

  if (!secondFactor) {
    const { token } = await app.sessions.create(user.id, ctx);

    return {
      code: 201,
      content: {
        id: user.id,
        token
      }
    };
  }

  const { send } = await app.verification.create(
    body.id,
    secondFactor,
    body.renew
  );
  const isEmail = isValidEmail(secondFactor);
  const content = { next: "code" };

  send && (await send(isEmail ? "email" : "phone"));

  if (isEmail && body.id !== secondFactor) {
    // mask email -> ema**@provider.com
    const parts = secondFactor.split("@");
    content.target = `${parts[0].slice(0, 3).padEnd(parts[0].length, "*")}@${
      parts[1]
    }`;
  } else {
    // last 4 celphone digits
    content.target = `** *****-${secondFactor.slice(
      secondFactor.length - 4,
      secondFactor.length
    )}`;
  }

  return { content };
}
