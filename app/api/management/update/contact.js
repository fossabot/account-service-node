import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import app from "../../../";

export default async function contact(
  { busboy, body, user, userId },
  { models, createError, verification, utils }
) {
  await busboy.finish();

  /**
   * Fields validation
   */
  if (!validate(body, app)) {
    throw createError(400, "invalid fields");
  }

  /**
   * Confirm addition
   */
  if (body.code) {
    if (!(await verification.confirm(`${userId}${body.add}`, body.code)))
      throw createError(406, "invalid code");

    const type = utils.regex.phone.test(body.add) ? "phones" : "emails";
    const current = [...user.data[type]];

    current.push(body.add);

    await user.update({ [type]: current });
  }

  /**
   * Remove request
   */
  if (body.remove) {
    const item = body.remove;
    const allContacts = [...user.data.emails, ...user.data.phones];
    const type = utils.regex.phone.test(body.remove) ? "phones" : "emails";

    if (allContacts.length === 1)
      throw createError(406, "can't remove all contact methods");

    if (user.data.secondFactor) {
      const compare = type === "phones" ? `+${user.data.ncode}${item}` : item;
      if (compare === user.data.secondFactor)
        throw createError(406, "not allowed");
    }

    const current = [...user.data[type]];
    const index = current.indexOf(body.remove);

    current.splice(index, 1);

    await user.update({ [type]: current });
  }

  /**
   * Addition request
   */
  if (body.add && !body.code) {
    const { data } = await models.users.get(body.add);

    if (data) {
      throw createError(406, "in use");
    }

    const type = utils.regex.phone.test(body.add) ? "phones" : "emails";
    const to = type === "phones" ? `+${user.data.ncode}${body.add}` : body.add;

    const { send } = await verification.create(
      `${userId}${body.add}`,
      to,
      body.renew
    );

    send && (await send(type === "phones" ? "phone" : "email"));
  }

  return {
    code: 201,
    content: { message: "ok" }
  };
}
/**
 * Validation
 */
function validate({ add, remove, code }, app) {
  if (code && code.length !== 5) throw app.createError(400, "invalid code");
  if (!add && !remove) throw app.createError(400, "undefined action");

  if (add && isInvalid(add)) {
    return false;
  }

  if (remove && isInvalid(remove)) {
    return false;
  }

  return true;
}

function isInvalid(field) {
  return !app.utils.regex.phone.test(field) && !isValidEmail(field);
}
