import { invalidToken, withoutPermission } from "./errors";

export default function createAuthMiddleware({ accessGroups } = {}) {
  return async function authMiddleware(ctx, app) {
    const {
      headers: { authorization: token, "user-agent": ua }
    } = ctx;

    if (!token) {
      throw app.createError(invalidToken.statusCode, invalidToken.message, {
        code: invalidToken.code
      });
    }

    const tokenData = app.jwt.decode(token);

    if (!tokenData) {
      throw app.createError(invalidToken.statusCode, invalidToken.message, {
        code: invalidToken.code
      });
    }

    const { uid, sid } = tokenData;
    const tokenId = `${uid}.${sid}`;

    if (!(await app.cache.get("token", tokenId))) {
      try {
        await app.jwt.verify(token);
      } catch (origin) {
        throw app.createError(invalidToken.statusCode, invalidToken.message, {
          code: invalidToken.code,
          origin
        });
      }
    }

    const session = await verifySession(app, sid, ua);

    if (accessGroups && accessGroups.indexOf(session.lvl) === -1) {
      throw app.createError(
        withoutPermission.statusCode,
        withoutPermission.message,
        {
          code: withoutPermission.code
        }
      );
    }

    await app.cache.set("token", tokenId, true);

    ctx.session = session;
    ctx.userId = uid;
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

  throw app.createError(invalidToken.statusCode, invalidToken.message, {
    code: invalidToken.code
  });
}
