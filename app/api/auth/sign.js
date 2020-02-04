import { compare } from "bcrypt";

export default async function signSession(
  { busboy, body, headers, ip, ips },
  app
) {
  await busboy.finish();

  const [user] = await app.models.users.get(body.id);

  if (!body.id || !body.pw) throw app.createError(400, "incomplete fields");

  if (!user) {
    throw app.createError(422, "user not found");
  }

  const pwMatch = await compare(body.pw, user.data.pw);

  if (pwMatch) {
    const session = {
      user_id: user.id,
      created: new Date().toString(),
      ua: headers["user-agent"],
      ip: ip || ips[ips.length - 1]
    };

    const { id: sid } = await app.models.sessions.create(session);

    const token = await app.jwt.sign({ uid: user.id, sid });

    // app.report("info", "sign-in", session);
    return {
      code: 201,
      content: {
        token
      }
    };
  }

  throw app.createError(401, "wrong credentials");
}

module.exports = signSession;
