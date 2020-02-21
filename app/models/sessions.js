const collection = "sessions";

export default function sessionsModel(storage) {
  function set(session) {
    return storage.set(collection, session);
  }

  async function get(docId) {
    const { id, data } = await storage.get(collection, docId);

    return data ? { id, ...data } : {};
  }

  function del(id) {
    return storage.del(collection, id);
  }

  return {
    set,
    get,
    del
  };
}
