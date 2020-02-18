import { compare } from "bcrypt";

export default async function credential(
  { busboy, body, headers, ip, ips },
  app
) {
  await busboy.finish();

  if (!body.id || body.id.length > 30 || !body.pw) throw app.createError(400);

  const { id: uid, data } = await app.models.users.get(body.id);
  if (!data) {
    return { content: { user: null } };
  }

  const pwMatch = await compare(body.pw, data.pw);

  if (!pwMatch) {
    throw app.createError(401, "wrong credentials");
  }

  if (data.authSecondFactor !== false) {
    const { code, message, created } = app.utils.makeVerifyCode();

    if (process.env.NODE_ENV === "production") {
      /*
      if(isValidEmail(data.authSecondFactor))
        await app.email.send("auth", data.authSecondFactor, message, messageHTML);
      */
      await app.sms.send(`+${data.ncode}${data.authSecondFactor}`, message);
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("Code:", code);
      }
    }

    await app.cache.set(
      "verificationCode",
      body.id,
      { code, created, confirmed: false, cpf: "" },
      60 * 5
    );

    return {
      content: {
        next: "code"
      }
    };
  }

  const session = {
    user_id: uid,
    created: new Date().toString(),
    ua: headers["user-agent"],
    ip: ip || ips[ips.length - 1],
    lvl: data.access
  };

  const { id: sid } = await app.models.sessions.create(session);

  const token = await app.jwt.sign({
    uid,
    sid,
    lvl: data.access
  });

  return {
    code: 201,
    content: {
      id: uid,
      token
    }
  };
}
