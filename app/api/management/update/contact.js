import { contact as contactValidation } from "./validations";
import { contact as contactErr } from "./errors";

const validationFields = {
  code: contactValidation.code,
  add: contactValidation.item,
  remove: contactValidation.item
};

export default function makeContactController(app) {
  const {
    data,
    validation: { error, validate },
    verification,
    utils: {
      regex: { phone: phoneRegEx }
    }
  } = app;

  return async function contact(ctx) {
    /**
     * Fields validation
     */
    if (!ctx.body.add && !ctx.body.remove) {
      throw error(contactErr.invalid);
    }
    await validate(ctx.body, validationFields);

    /**
     * Remove request
     */
    if (ctx.body.remove) {
      const item = ctx.body.remove;
      const allContacts = [...ctx.user.data.emails, ...ctx.user.data.phones];
      const type = phoneRegEx.test(ctx.body.remove) ? "phones" : "emails";

      if (allContacts.length === 1) {
        throw error(contactErr.item.remove.single);
      }

      if (ctx.user.data.authSecondFactor) {
        const compare =
          type === "phones" ? `+${ctx.user.data.ncode}${item}` : item;
        if (compare === ctx.user.data.authSecondFactor) {
          throw error(contactErr.item.remove.secondFactor);
        }
      }

      const current = [...ctx.user.data[type]];
      const index = current.indexOf(ctx.body.remove);

      current.splice(index, 1);

      await ctx.user.update({ [type]: current });
    }

    /**
     * Addition request
     */
    if (ctx.body.add && !ctx.body.code) {
      if (await data.users.get(ctx.body.add)) {
        throw error(contactErr.item.add.inUse);
      }

      const type = phoneRegEx.test(ctx.body.add) ? "phones" : "emails";
      const to =
        type === "phones"
          ? `+${ctx.user.data.ncode}${ctx.body.add}`
          : ctx.body.add;

      await verification.create(
        `${ctx.user.data.id}${ctx.body.add}`,
        to,
        ctx.body.renew
      );
    }

    /**
     * Confirm addition
     */
    if (ctx.body.code) {
      const cacheKey = `${ctx.user.data.id}${ctx.body.add}`;
      if (!(await verification.check(cacheKey, ctx.body.code))) {
        throw error(contactErr.code.wrong);
      }

      const type = phoneRegEx.test(ctx.body.add) ? "phones" : "emails";
      const current = [...ctx.user.data[type]];

      current.push(ctx.body.add);

      await ctx.user.update({ [type]: current });
      await verification.remove(cacheKey);
    }

    return true;
  };
}
