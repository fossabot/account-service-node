import sp from "schemapack";

/**
 * Standards
 */
const boolean = sp.build("boolean");

export const verificationCode = sp.build({
  code: "string",
  created: "string",
  cpf: "string",
  confirmed: "boolean"
});

export const session = sp.build({
  id: "string",
  uid: "string",
  created: "string",
  ua: "string",
  ip: "string",
  active: "boolean"
});

export const token = boolean;
export const availableCPF = boolean;
