import { compare } from "bcrypt";
import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import { userNotFound, wrongPassword } from "./errors";
import { id, pw } from "./validations";

export default async function credential(ctx, app) {
  const { busboy, body } = ctx;
  await busboy.finish();
  await app.validation(ctx.body, { id, pw });

  const user = await app.models.users.get(body.id);
  console.log("@user", user);
  if (!user) {
    throw userNotFound();
  }

  if (!(await compare(body.pw, user.pw))) {
    throw wrongPassword();
  }

  const secondFactor = user.authSecondFactor;

  if (!secondFactor) {
    const { token: content } = await app.sessions.create(user.id, ctx);

    return {
      code: 201,
      content: {
        content
      }
    };
  }

  const { send } = await app.verification.create(
    body.id,
    secondFactor,
    body.renew
  );
  const isEmail = isValidEmail(secondFactor);

  send && (await send(isEmail ? "email" : "phone"));

  if (isEmail && body.id !== secondFactor) {
    // mask email -> ema**@provider.com
    const parts = secondFactor.split("@");
    return {
      content: {
        content: `${parts[0].slice(0, 3).padEnd(parts[0].length, "*")}@${
          parts[1]
        }`
      }
    };
  } else {
    // last 4 celphone digits
    return {
      content: {
        content: `** *****-${secondFactor.slice(
          secondFactor.length - 4,
          secondFactor.length
        )}`
      }
    };
  }
}
