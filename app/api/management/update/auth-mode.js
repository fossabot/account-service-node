import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default async function updateAuthMode({ busboy, body, user }, app) {
  await busboy.finish();

  const { authSecondFactor: value } = body;

  const phone = app.utils.regex.phoneWithCountryCode.exec(value);
  const isEmail = isValidEmail(value);

  if (value !== "false" && !phone && !isEmail) {
    throw app.createError(400, "must be an email or mobile phone number");
  }

  if (value !== "false") {
    if (
      phone &&
      user.data.phones.indexOf(`${phone[2]}${phone[3]}${phone[4]}`) === -1
    )
      throw app.createError(406, "not owner of this contact");

    if (isEmail && user.data.emails.indexOf(value) === -1)
      throw app.createError(406, "not owner of this contact");
  }

  await user.update({ authSecondFactor: phone || isEmail ? value : false });

  return { code: 201, content: { message: "ok" } };
}
