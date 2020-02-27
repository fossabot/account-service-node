import { code, cpf, birth } from "./validations";

export default async function cpfController(
  { body },
  { validation, verification }
) {
  await validation(body, {
    code,
    cpf,
    birth
  });

  await verification.update(`reg:${body.phone}`, { cpf: body.cpf });

  return { code: 200 };
}
