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

export const sessions = sp.build({
  user_id: "string",
  created: "string",
  ua: "string",
  ip: "string"
});

export const token = sp.build({
  sid: "string",
  uid: "string",
  iat: "varuint"
});

export const availableCPF = boolean;
