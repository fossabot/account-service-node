const collection = "sessions";

export default function sessionsModel(storage) {
  function set(id, data) {
    return storage.set(collection, id, data);
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
