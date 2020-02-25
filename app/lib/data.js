export default function buildDataWorker({ models, cache }) {
  async function get(namespace, key, persistent) {
    const fromCache = await cache.get(namespace, key);

    if (fromCache) return fromCache;

    if (persistent) {
      const fromPersistent = await persistent();
      if (fromPersistent) {
        cache
          .set(namespace, key, fromPersistent)
          .catch(err =>
            console.error(
              "Failed to save dataWorker cache, namespace:",
              namespace,
              "key:",
              key,
              "error",
              err
            )
          );
      }
      return fromPersistent;
    }
  }

  async function set(namespace, key, data, persistent) {
    // update cache
    await cache.set(namespace, key, {
      ...((await cache.get(namespace, key)) || {}),
      ...data
    });

    if (persistent) {
      await persistent();
    }
  }

  function configure(name, persistent = {}) {
    struct[name] = {
      get: key => get(name, key, persistent.get && (() => persistent.get(key))),
      set: (key, data) =>
        set(
          name,
          key,
          data,
          persistent.set && (() => persistent.set(key, data))
        )
    };
  }

  const struct = { get, set, configure };

  configure("verification");
  configure("users", {
    get: key => models.users.get(key),
    set: (key, data) => models.users.set(key, data)
  });

  // app.data.users.get("ferco0@live.com"); // cache first !-> database

  return struct;
}
