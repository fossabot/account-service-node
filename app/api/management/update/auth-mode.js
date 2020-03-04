import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import { auth } from "./errors";

export default async function updateAuthMode(ctx, { utils, validation }) {
  const { authSecondFactor: value } = ctx.body;

  if (value === "false") {
    await ctx.user.update({ authSecondFactor: false });
    return true;
  }

  const phone = utils.regex.phoneWithCountryCode.exec(value);
  const isEmail = isValidEmail(value);

  if (!phone && !isEmail) {
    throw validation.error(auth.invalid(ctx.language));
  }

  const { phones, emails } = ctx.user.data;

  if (
    (phone && phones.indexOf(`${phone[2]}${phone[3]}${phone[4]}`) === -1) ||
    (isEmail && emails.indexOf(value) === -1)
  ) {
    throw validation.error(auth.notOwn(ctx.language));
  }

  await ctx.user.update({ authSecondFactor: value });

  return true;
}
