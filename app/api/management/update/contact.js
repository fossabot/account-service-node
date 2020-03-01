// import { isValidEmail } from "@brazilian-utils/brazilian-utils";
// import app from "../../../";
import { contact as contactValidation } from "./validations";
import { contact as contactErr } from "./errors";

export default async function contact(ctx, app) {
  const { body, user, userId } = ctx;
  const { cache, models, createError, verification, utils } = app;
  /**
   * Fields validation
   */
  if (!body.add && !body.remove) {
    throw createError(
      contactErr.invalid.statusCode,
      contactErr.invalid.message,
      { code: contactErr.invalid.code }
    );
  }
  await app.validation.validate(body, {
    code: contactValidation.code,
    add: contactValidation.item,
    remove: contactValidation.item
  });

  /**
   * Remove request
   */
  if (ctx.body.remove) {
    const item = body.remove;
    const allContacts = [...user.data.emails, ...user.data.phones];
    const type = utils.regex.phone.test(body.remove) ? "phones" : "emails";

    if (allContacts.length === 1)
      throw createError(
        contactErr.item.remove.single.statusCode,
        contactErr.item.remove.single.message,
        {
          code: contactErr.item.remove.single.code
        }
      );

    if (user.data.authSecondFactor) {
      const compare = type === "phones" ? `+${user.data.ncode}${item}` : item;
      if (compare === user.data.authSecondFactor)
        throw createError(
          contactErr.item.remove.secondFactor.statusCode,
          contactErr.item.remove.secondFactor.message,
          {
            code: contactErr.item.remove.secondFactor.code
          }
        );
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
    if (await models.users.get(body.add)) {
      throw createError(
        contactErr.item.add.inUse.statusCode,
        contactErr.item.add.inUse.message,
        { code: contactErr.item.add.inUse.code }
      );
    }

    const type = utils.regex.phone.test(body.add) ? "phones" : "emails";
    const to = type === "phones" ? `+${user.data.ncode}${body.add}` : body.add;

    await verification.create(`${userId}${body.add}`, to, body.renew);
  }

  /**
   * Confirm addition
   */
  if (body.code) {
    const cacheKey = `${userId}${body.add}`;
    if (!(await verification.check(cacheKey, body.code)))
      throw createError(
        contactErr.code.wrong.statusCode,
        contactErr.code.wrong.message,
        { code: contactErr.code.wrong.code }
      );

    const type = utils.regex.phone.test(body.add) ? "phones" : "emails";
    const current = [...user.data[type]];

    current.push(body.add);

    await user.update({ [type]: current });
    await cache.del(cacheKey);
  }

  return true;
}
/**
 * Validation
 */
/*
function validate({ add, remove, code }, app) {
  if (typeof code !== "undefined" && code.length !== 5)
    throw app.createError(400, "invalid code");
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
*/
