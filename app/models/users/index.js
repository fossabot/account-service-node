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
    if (isValidEmail(id)) return this.getByEmail(id);
    if (isValidCPF(id)) return this.getByCPF(id);

    return this.getById(id);
  }

  query(query) {
    return this.storage.get(collection, query);
  }

  async getById(id) {
    const data = await this.query(id);
    return data;
  }

  async getByPhone(nbr) {
    const [user = { data: undefined }] = await this.query({
      where: ["phones", "array-contains", nbr]
    });
    return user;
  }

  async getByCPF(cpf) {
    const [data = { data: undefined }] = await this.query({
      where: ["cpf", "==", cpf]
    });
    return data;
  }

  async getByUsername(user) {
    const [data = { data: undefined }] = await this.query({
      where: ["username", "==", user]
    });
    return data;
  }
}
/*
export default function usersModel(storage, app) {
  return {
    async create({ birth, pw, ...data }) {
      return this.storage.set(collection, {
        ...data,
        birth: new Date(birth),
        pw: await hash(pw, 10)
      });
    },
    async set(id, data) {
      return this.storage.set(collection, id, data);
    },
    async get(id) {
      if (app.utils.regex.phone.test(id)) return;

      const query = app.utils.regex.phone.test(id)
        ? { where: ["nbr", "==", id] }
        : isValidEmail(id)
        ? { where: ["email", "==", id] }
        : isValidCPF(id)
        ? { where: ["cpf", "==", id] }
        : id;

      const result = await this.storage.get(collection, query);

      return Array.isArray(result) ? result : [result];
    },
    query(query) {
      return this.storage.get(collection, query);
    },
    async getById(id) {
      const { data } = await this.storage.get(collection, id);
      return data;
    },
    async getByPhone(nbr) {
      const [user = { data: undefined }] = await this.storage.get(collection, {
        where: ["phones", "array-contains", nbr]
      });
      return user;
    },
    async getByCPF(cpf) {
      const [data = { data: undefined }] = await this.storage.get(collection, {
        where: ["cpf", "==", cpf]
      });
      return data;
    },
    async getByUsername(user) {
      const [data = { data: undefined }] = await this.storage.get(collection, {
        where: ["username", "==", user]
      });
      return data;
    }
  };
}
*/
