import { errors } from "../../../../test/utils";

export const invalidId = {
  ...errors[422],
  message: "Invalid identification",
  code: "1"
};

export const userNotFound = {
  ...errors[404],
  message: "User not found",
  code: "2"
};

export const invalidPassword = {
  ...errors[422],
  message: "Invalid password",
  code: "3"
};

export const wrongPassword = {
  ...errors[422],
  message: "Wrong password",
  code: "4"
};

export const invalidCode = {
  ...errors[422],
  message: "Invalid code",
  code: "5"
};

export const wrongCode = {
  ...errors[422],
  message: "Wrong code",
  code: "6"
};
