import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default async function updateAuthMode({ busboy, body, user }, app) {
  await busboy.finish();

  const { authSecondFactor: value } = body;

  const isPhone = app.utils.regex.phone.test(value);
  const isEmail = isValidEmail(value);

  if (value !== "false" && !isPhone && !isEmail) {
    throw app.createError(400, "must be an email or mobile phone number");
  }
  console.log(value, isPhone);
  if (
    value !== "false" &&
    ((isPhone && user.data.phones.indexOf(value) === -1) ||
      (isEmail && user.data.emails.indexOf(value) === -1))
  ) {
    throw app.createError(406);
  }

  await user.update({ authSecondFactor: isPhone || isEmail ? value : false });

  return { content: { message: "ok" } };
}
