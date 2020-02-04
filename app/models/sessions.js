const collection = "sessions";

export default function sessionsModel(storage) {
  function create(session) {
    return storage.set(collection, session);
  }

  function get(id) {
    return storage.get(collection, id);
  }

  function del(id) {
    return storage.del(collection, id);
  }

  return {
    create,
    get,
    del
  };
}
