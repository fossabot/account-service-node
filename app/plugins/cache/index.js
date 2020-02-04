import * as schemas from "./schemas";

export default function cacheApi(redis) {
  function set(namespace, key, content, ex = false) {
    throwIfNotFoundSchema(namespace);
    const contentParsed = schemas[namespace].encode(content);

    if (ex !== false)
      return redis.set(`${namespace}:${key}`, contentParsed, "EX", ex);

    return redis.set(`${namespace}:${key}`, contentParsed);
  }

  async function get(namespace, key) {
    throwIfNotFoundSchema(namespace);
    const buff = await redis.getBuffer(`${namespace}:${key}`);

    return buff && schemas[namespace].decode(buff);
  }

  function del(namespace, key) {
    return redis.del(`${namespace}:${key}`);
  }

  return { set, get, del };
}

export function throwIfNotFoundSchema(namespace) {
  if (!(namespace in schemas))
    throw new Error(`Not found schema for namespace "${namespace}"`);
}
