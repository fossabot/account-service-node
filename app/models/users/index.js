import bcrypt from "bcrypt";
import { isValidEmail, isValidCPF } from "@brazilian-utils/brazilian-utils";

const collection = "users";

export default function usersModel(storage, app) {
  return {
    async create({ username, fn, ln, nbr, cpf, birth, pw }) {
      const userData = {
        cpf,
        nbr,
        username,
        fn,
        ln,
        birth: new Date(birth),
        pw: await bcrypt.hash(pw, 10)
      };

      return storage.set(collection, userData);
    },
    async get(id) {
      const query = app.utils.regex.phone.test(id)
        ? { where: ["nbr", "==", id] }
        : isValidEmail(id)
        ? { where: ["email", "==", id] }
        : isValidCPF(id)
        ? { where: ["cpf", "==", id] }
        : id;

      const result = await storage.get(collection, query);

      return Array.isArray(result) ? result : [result];
    },
    query(query) {
      return storage.get(collection, query);
    },
    async getById(id) {
      const { data } = await storage.get(collection, id);
      return data;
    },
    async getByPhone(nbr) {
      const [user = { data: undefined }] = await storage.get(collection, {
        where: ["nbr", "==", nbr]
      });
      return user;
    },
    async getByCPF(cpf) {
      const [data = { data: undefined }] = await storage.get(collection, {
        where: ["cpf", "==", cpf]
      });
      return data;
    },
    async getByUsername(user) {
      const [data = { data: undefined }] = await storage.get(collection, {
        where: ["username", "==", user]
      });
      return data;
    }
  };
}
