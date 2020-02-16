export default function createAuthMiddleware({ accessGroups } = {}) {
  return async function authMiddleware(ctx, app) {
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

    if (accessGroups && accessGroups.indexOf(decoded.lvl) === -1) {
      throw app.createError(403, "not allowed");
    }

    const session = await verifySession(app, decoded.sid, ua);

    await app.cache.set("sessions", decoded.sid, session, 3600 * 60);
    await app.cache.set("token", token, decoded, 3600 * 15);

    ctx.attach("user_id", decoded.uid);
  };
}

async function verifySession(app, id, ua) {
  const sessionCache = await app.cache.get("sessions", id);

  if (sessionCache /* && sessionCache.ua === ua */) {
    return sessionCache;
  }

  const { data } = await app.models.sessions.get(id);

  if (data /* && data.ua === ua */) {
    return data;
  }

  throw app.createError(406, "session not found");
}
