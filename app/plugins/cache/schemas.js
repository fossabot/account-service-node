import sp from "schemapack";

// const string = sp.build("string");

export const verificationCode = sp.build({
  code: "string",
  created: "string",
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
