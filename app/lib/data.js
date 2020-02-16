export default function buildDataWorker({ models, cache }) {
  async function get({ namespace, key, fallback }) {
    const fromCache = await cache.get(namespace, key);

    if (fromCache) return fromCache;

    if (fallback) {
      const fromFallback = await fallback();
      if (fromFallback) {
        cache.set(namespace, key, fromFallback);
      }
      return fromFallback;
    }
  }

  function configure({ name, fallback }) {
    struct[name] = {
      get: key => {
        get(name, key, fallback.get(key));
      }
    };
  }
  /**
   
  app.data.configure({
    name: "users",
    fallback: {
      get: key => async () => {
        const [user] = await app.models.users.get(key)

        return user.data || null;
      }
    }
  })

  app.data.users.get("ferco0@live.com") // cache first !-> database

   */

  const struct = { get, configure };
  return struct;
}
