import { compare } from "bcrypt";
import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import { user, password } from "./errors";
import { id, pw } from "./validations";

export default async function credential(ctx, app) {
  await app.validation.validate(ctx.body, { id, pw });

  const userQuery = await app.models.users.get(ctx.body.id);
  if (!userQuery) {
    throw app.createError(user.notFound.statusCode, user.notFound.message, {
      code: user.notFound.code
    });
  }

  if (!(await compare(ctx.body.pw, userQuery.pw))) {
    throw app.createError(password.wrong.statusCode, password.wrong.message, {
      code: password.wrong.code
    });
  }

  const secondFactor = userQuery.authSecondFactor;

  if (!secondFactor) {
    const { token: content } = await app.sessions.create(userQuery.id, ctx);

    return {
      code: 201,
      body: {
        content
      }
    };
  }

  await app.verification.create(ctx.body.id, secondFactor, ctx.body.renew);
  const isEmail = isValidEmail(secondFactor);

  if (isEmail) {
    // mask email -> ema**@provider.com
    const parts = secondFactor.split("@");
    return {
      body: {
        content: `${parts[0].slice(0, 3).padEnd(parts[0].length, "*")}@${
          parts[1]
        }`
      }
    };
  } else {
    // last 4 celphone digits
    return {
      body: {
        content: `** *****-${secondFactor.slice(
          secondFactor.length - 4,
          secondFactor.length
        )}`
      }
    };
  }
}
