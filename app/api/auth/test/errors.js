import { errors as errorsBases } from "../../../../test/utils";
import * as errors from "../errors";

const e422 = errorsBases[422];

export const identification = {
  invalid: {
    ...e422,
    ...errors.identification.invalid
  }
};

export const user = {
  invalid: {
    ...e422,
    ...errors.user.notFound
  }
};

export const password = {
  invalid: {
    ...e422,
    ...errors.password.invalid
  },
  wrong: {
    ...e422,
    ...errors.password.wrong
  }
};

export const code = {
  invalid: {
    ...e422,
    ...errors.code.invalid
  },
  wrong: {
    ...e422,
    ...errors.code.wrong
  }
};
