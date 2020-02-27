export default function createAuthMiddleware({ accessGroups } = {}) {
  return async function authMiddleware(ctx, app) {
    const {
      headers: { authorization: token, "user-agent": ua }
    } = ctx;

    if (!token) throw app.createError(400, "token must be provided");

    const tokenData = app.jwt.decode(token);

    if (!tokenData) throw app.createError(422, "invalid token");

    const { uid, sid } = tokenData;
    const tokenId = `${uid}.${sid}`;

    if (!(await app.cache.get("token", tokenId))) {
      try {
        await app.jwt.verify(token);
      } catch (origin) {
        throw app.createError(422, "invalid token", { origin });
      }
    }

    const session = await verifySession(app, sid, ua);

    if (accessGroups && accessGroups.indexOf(session.lvl) === -1) {
      throw app.createError(403);
    }

    await app.cache.set("token", tokenId, true);

    ctx.attach("session", session);
    ctx.attach("userId", uid);
  };
}

async function verifySession(app, id, ua) {
  const sessionCache = await app.cache.get("session", id);

  if (sessionCache && sessionCache.active) {
    return sessionCache;
  }

  const { data } = await app.models.sessions.get(id);
  data && (await app.cache.set("session", id, data));

  if (data && data.active) {
    return data;
  }

  throw app.createError(422, "invalid session");
}
