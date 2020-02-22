export default function sessions({ cache, jwt, models: { users, sessions } }) {
  async function create(id, ctx) {
    const { id: uid, data } = await users.get(id);

    const session = {
      uid,
      created: new Date().toString(),
      ua: ctx.headers["user-agent"],
      ip: ctx.ip || ctx.ips[ctx.ips.length - 1],
      lvl: data.access,
      active: true
    };

    const { id: sid } = await sessions.set(session);

    const token = await jwt.sign({ uid, sid });

    session.id = sid;

    await cache.set("session", sid, session);
    await cache.set("token", `${uid}.${sid}`, true);

    return { token, session };
  }

  async function remove(uid, sid) {
    const activeProp = { active: false };

    await sessions.set(sid, activeProp);
    await cache.update("session", sid, activeProp);
    await cache.del("token", `${uid}.${sid}`);
  }

  return { create, remove };
}
