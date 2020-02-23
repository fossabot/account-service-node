import { isValidEmail } from "@brazilian-utils/brazilian-utils";
import app from "../../../";

export default async function contact({ busboy, body, user }, app) {
  await busboy.finish();

  if (!validate(body, app)) {
    throw app.createError(400, "invalid fields");
  }
  if (body.remove) {
    await remove(
      user,
      body.remove,
      app.utils.regex.phone.test(body.remove) ? "phones" : "emails"
    );
  }

  if (body.add) {
    await add(
      user,
      body.add,
      app.utils.regex.phone.test(body.remove) ? "phones" : "emails"
    );
  }

  return {
    content: { message: "ok" }
  };
}

async function add(user, item, field) {
  const current = [...user.data[field]];

  current.push(item);

  return user.update({ [field]: current });
}

async function remove(user, item, field) {
  const allContacts = [...user.data.emails, ...user.data.phones];

  if (allContacts.length === 1)
    throw app.createError(406, "can't remove all contact methods");

  if (user.data.secondFactor) {
    const compare = field === "phones" ? `+${user.data.ncode}${item}` : item;
    if (compare === user.data.secondFactor)
      throw app.createError(406, "not allowed");
  }

  const current = [...user.data[field]];

  const index = current.indexOf(item);

  current.splice(index, 1);

  return user.update({ [field]: current });
}

function validate({ add, remove }, app) {
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
