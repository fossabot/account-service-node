import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default async function updateAuthMode({ busboy, body, user }, app) {
  await busboy.finish();

  let { authSecondFactor: value } = body;

  const isPhone = app.utils.regex.phone.test(value);
  const isEmail = isValidEmail(value);

  if (value !== "false" && !isPhone && !isEmail) {
    throw app.createError(400, "must be an email or mobile phone number");
  }

  if (
    value !== "false" &&
    ((isPhone && user.data.phones.indexOf(value) === -1) ||
      (isEmail && user.data.emails.indexOf(value) === -1))
  ) {
    throw app.createError(406);
  }

  if (isPhone) {
    value = `+${user.data.ncode}${value}`;
  }

  await user.update({ authSecondFactor: isPhone || isEmail ? value : false });

  return { content: { message: "ok" } };
}
