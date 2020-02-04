import bcrypt from "bcrypt";
import { isValidEmail, isValidCPF } from "@brazilian-utils/brazilian-utils";

const collection = "users";

export default function usersModel(storage, app) {
  return {
    async create({ name, nbr, cpf, birth, pw }) {
      name = name.split(" ");

      const userData = {
        cpf,
        nbr,
        fn: name[0],
        birth: new Date(birth),
        pw: await bcrypt.hash(pw, 10)
      };

      if (name.length >= 2) {
        userData.ln = name[name.length - 1];
      }

      const { data } = await storage.set(collection, userData);
      return data;
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
    async getById(id) {
      const { data } = await storage.get(collection, id);
      return data;
    },
    async getByPhone(nbr) {
      const [data] = await storage.get(collection, {
        where: ["nbr", "==", nbr]
      });
      return data;
    },
    async getByCpf(cpf) {
      const [data] = await storage.get(collection, {
        where: ["cpf", "==", cpf]
      });
      return data;
    }
  };
}
