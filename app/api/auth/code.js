export default async function code({ ip, ips, headers, body, busboy }, app) {
  await busboy.finish();

  const { ref, code } = body;

  if (!ref || !code || code.length !== 5) throw app.createError(400);

  const codeData = await app.cache.get("verificationCode", ref);

  if (!codeData) throw app.createError(406);
  if (codeData.code !== code) throw app.createError(400);

  const { id: uid, data } = await app.models.users.get(codeData.to);

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

  app.cache
    .del("verificationCode", ref)
    .catch(e => console.error("Delete verification register code, err:", e));

  return {
    content: { message: "ok", token }
  };
}
