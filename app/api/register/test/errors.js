import { errors as errorsBases } from "../../../../test/utils";
import * as error from "../errors";

export const invalidCountryCode = {
  ...errorsBases[422],
  ...error.countryCode.invalid
};

export const invalidPhone = {
  ...errorsBases[422],
  ...error.phone.invalid
};

export const phoneInUse = {
  ...errorsBases[422],
  ...error.phone.inUse
};

export const invalidCode = {
  ...errorsBases[422],
  ...error.code.invalid
};

export const wrongCode = {
  ...errorsBases[422],
  ...error.code.wrong
};

export const invalidCPF = {
  ...errorsBases[422],
  ...error.cpf.invalid
};

export const inUseCPF = {
  ...errorsBases[422],
  ...error.cpf.inUse
};

export const invalidBirth = {
  ...errorsBases[422],
  ...error.birth.invalid
};

export const invalidPassword = {
  ...errorsBases[422],
  ...error.password.invalid
};

export const invalidUsername = {
  ...errorsBases[422],
  ...error.username.invalid
};

export const inUseUsername = {
  ...errorsBases[422],
  ...error.username.inUse
};

export const invalidFirstname = {
  ...errorsBases[422],
  ...error.firstName.invalid
};

export const invalidLastname = {
  ...errorsBases[422],
  ...error.lastName.invalid
};
