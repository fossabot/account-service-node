import app from "../../index";
import { hash } from "bcrypt";
import { isValidEmail, isValidCPF } from "@brazilian-utils/brazilian-utils";

const collection = "users";

export default class UsersModel {
  constructor(storage) {
    this.storage = storage;
  }

  async create({ birth, pw, ...data }) {
    return this.storage.set(collection, {
      ...data,
      birth: new Date(birth),
      pw: await hash(pw, 10)
    });
  }

  async set(id, data) {
    return this.storage.set(collection, id, data);
  }

  async get(id) {
    if (app.utils.regex.phone.test(id)) return this.getByPhone(id);
    if (app.utils.regex.username.test(id)) return this.getByUsername(id);
    if (isValidEmail(id)) return this.getByEmail(id);
    if (isValidCPF(id)) return this.getByCPF(id);

    return this.getById(id);
  }

  query(query) {
    return this.storage.get(collection, query);
  }

  async queryWhere(where) {
    const [{ id, data } = {}] = await this.query({
      where
    });

    if (data) {
      data.birth = data.birth.toDate();
      return { id, ...data };
    }
  }

  async getById(docId) {
    const { id, data } = await this.query(docId);

    if (data) {
      data.birth = data.birth.toDate();
      return { id, ...data };
    }
  }

  getByPhone(nbr) {
    return this.queryWhere(["phones", "array-contains", nbr]);
  }

  getByEmail(email) {
    return this.queryWhere(["emails", "array-contains", email]);
  }

  getByCPF(cpf) {
    return this.queryWhere(["cpf", "==", cpf]);
  }

  getByUsername(user) {
    return this.queryWhere(["username", "==", user]);
  }
}
