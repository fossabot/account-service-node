import { errors as errorsBases } from "../../../../test/utils";
import * as error from "../errors";

export const invalidCountryCode = {
  ...errorsBases[422],
  ...error.countryCode.invalid("en")
};

export const invalidPhone = {
  ...errorsBases[422],
  ...error.phone.invalid("en")
};

export const phoneInUse = {
  ...errorsBases[422],
  ...error.phone.inUse("en")
};

export const invalidCode = {
  ...errorsBases[422],
  ...error.code.invalid("en")
};

export const wrongCode = {
  ...errorsBases[422],
  ...error.code.wrong("en")
};

export const invalidCPF = {
  ...errorsBases[422],
  ...error.cpf.invalid("en")
};

export const inUseCPF = {
  ...errorsBases[422],
  ...error.cpf.inUse("en")
};

export const invalidBirth = {
  ...errorsBases[422],
  ...error.birth.invalid("en")
};

export const invalidPassword = {
  ...errorsBases[422],
  ...error.password.invalid("en")
};

export const invalidUsername = {
  ...errorsBases[422],
  ...error.username.invalid("en")
};

export const inUseUsername = {
  ...errorsBases[422],
  ...error.username.inUse("en")
};

export const invalidFirstname = {
  ...errorsBases[422],
  ...error.firstName.invalid("en")
};

export const invalidLastname = {
  ...errorsBases[422],
  ...error.lastName.invalid("en")
};
