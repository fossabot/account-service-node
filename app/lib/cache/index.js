import * as schemas from "./schemas";

export default function cacheApi(redis) {
  function set(namespace, key, content, ex = false) {
    const contentParsed = encode(namespace, content);

    if (ex !== false)
      return redis.set(`${namespace}:${key}`, contentParsed, "EX", ex);

    return redis.set(`${namespace}:${key}`, contentParsed);
  }

  async function get(namespace, key) {
    const data = await redis.getBuffer(`${namespace}:${key}`);

    return data && decode(namespace, data);
  }

  function del(namespace, key) {
    return redis.del(`${namespace}:${key}`);
  }

  return { set, get, del };
}

function encode(namespace, content) {
  if (!(namespace in schemas)) return JSON.strigify(content);

  return schemas[namespace].encode(content);
}

function decode(namespace, content) {
  if (!(namespace in schemas)) return JSON.parse(content);

  return schemas[namespace].decode(content);
}
