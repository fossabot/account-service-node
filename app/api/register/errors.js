export const countryCode = {
  invalid: { statusCode: 422, code: "1", message: "Invalid country code" }
};

export const phone = {
  invalid: { statusCode: 422, code: "2", message: "Invalid number" },
  inUse: { statusCode: 422, code: "3", message: "Number in use" }
};

export const code = {
  invalid: { statusCode: 422, code: "4", message: "Invalid code" },
  wrong: { statusCode: 422, code: "5", message: "Wrong code" }
};

export const cpf = {
  invalid: { statusCode: 422, code: "6", message: "Invalid cpf" },
  inUse: { statusCode: 422, code: "7", message: "CPF in use" }
};

export const birth = {
  invalid: { statusCode: 422, code: "8", message: "Invalid birth" }
};

export const password = {
  invalid: { statusCode: 422, code: "9", message: "Invalid password" }
};

export const username = {
  invalid: { statusCode: 422, code: "10", message: "Invalid username" },
  inUse: { statusCode: 422, code: "11", message: "Username in use" }
};

export const firstName = {
  invalid: { statusCode: 422, code: "12", message: "Invalid first name" }
};

export const lastName = {
  invalid: { statusCode: 422, code: "13", message: "Invalid last name" }
};
