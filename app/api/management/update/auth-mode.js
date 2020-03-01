import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import { auth } from "./errors";

export default async function updateAuthMode(ctx, app) {
  const { authSecondFactor: value } = ctx.body;

  if (value === "false") {
    await ctx.user.update({ authSecondFactor: false });
    return true;
  }

  const phone = app.utils.regex.phoneWithCountryCode.exec(value);
  const isEmail = isValidEmail(value);

  if (!phone && !isEmail) {
    throw app.createError(auth.invalid.statusCode, auth.invalid.message, {
      code: auth.invalid.code
    });
  }

  if (
    phone &&
    ctx.user.data.phones.indexOf(`${phone[2]}${phone[3]}${phone[4]}`) === -1
  ) {
    throw app.createError(auth.notOwn.statusCode, auth.notOwn.message, {
      code: auth.notOwn.code
    });
  }

  if (isEmail && ctx.user.data.emails.indexOf(value) === -1) {
    throw app.createError(auth.notOwn.statusCode, auth.notOwn.message, {
      code: auth.notOwn.code
    });
  }

  await ctx.user.update({ authSecondFactor: value });

  return true;
}
