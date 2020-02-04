export default async function authMiddleware(ctx, app) {
  const {
    headers: { authorization: token, "user-agent": ua }
  } = ctx;

  if (!token) throw app.createError(400, "token must be provided");

  let decoded = await app.cache.get("token", token);

  if (!decoded) {
    try {
      decoded = await app.jwt.verify(token);
    } catch (e) {
      throw app.createError(400, "invalid token", { origin: e });
    }
  }

  const session = await verifySession(app, decoded.sid, ua);

  await app.cache.set("sessions", decoded.sid, session, 3600 * 60);
  await app.cache.set("token", token, decoded, 3600 * 15);
  /*
  await app.redis.set(`session:${decoded.sid}`, JSON.stringify(session), "EX");
  await app.redis.set(`tv:${token}`, JSON.stringify(decoded), "EX", 60 * 15);
  */

  ctx.attach("user_id", decoded.uid);
}

async function verifySession(app, id, ua) {
  const sessionCache = await app.cache.get("sessions", id);

  if (sessionCache && sessionCache.ua === ua) {
    return sessionCache;
  }

  const { data } = await app.models.sessions.get(id);

  if (data && data.ua === ua) {
    return data;
  }

  throw app.createError(406, "session not found");
}
