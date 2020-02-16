import { compare } from "bcrypt";

export default async function signSession(
  { busboy, body, headers, ip, ips },
  app
) {
  await busboy.finish();

  if (!body.nbr || !app.utils.regex.phone.test(body.nbr) || !body.pw)
    throw app.createError(400, "incomplete or invalid fields");

  const user = await app.models.users.getByPhone(body.nbr);
  if (!user.data) {
    return { content: { user: null } };
  }

  const pwMatch = await compare(body.pw, user.data.pw);

  if (!pwMatch) {
    throw app.createError(401, "wrong credentials");
  }

  const session = {
    user_id: user.id,
    created: new Date().toString(),
    ua: headers["user-agent"],
    ip: ip || ips[ips.length - 1],
    lvl: user.data.access
  };

  const { id: sid } = await app.models.sessions.create(session);

  const token = await app.jwt.sign({
    uid: user.id,
    sid,
    lvl: user.data.access
  });

  return {
    code: 201,
    content: {
      id: user.id,
      token
    }
  };
}

module.exports = signSession;
