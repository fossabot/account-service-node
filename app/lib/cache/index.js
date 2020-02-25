import * as schemas from "./schemas";

const lifetimes = {
  session: process.env.SESSION_CACHE_LIFETIME || 3600 * 60, // 1h
  token: process.env.TOKEN_CACHE_LIFETIME || 3600 * 15 // 15m
};

export default function cacheApi(redis) {
  function set(namespace, key, content, ex = lifetimes[namespace]) {
    const contentParsed = encode(namespace, content);

    if (ex) return redis.set(`${namespace}:${key}`, contentParsed, "EX", ex);

    return redis.set(`${namespace}:${key}`, contentParsed);
  }

  async function get(namespace, key) {
    const data = await redis.getBuffer(`${namespace}:${key}`);

    if (data) return decode(namespace, data);
  }

  function del(namespace, key) {
    return redis.del(`${namespace}:${key}`);
  }

  async function update(namespace, key, data) {
    const curr = (await get(namespace, key)) || {};

    await set(namespace, key, { ...curr, ...data });
  }

  return { set, get, update, del };
}

function encode(namespace, content) {
  if (!(namespace in schemas)) return JSON.stringify(content);

  return schemas[namespace].encode(content);
}

function decode(namespace, content) {
  if (!(namespace in schemas)) return JSON.parse(content);

  return schemas[namespace].decode(content);
}
