import { errors as errorsBases } from "../../../../test/utils";
import * as errors from "../errors";

const e422 = errorsBases[422];

export const identification = {
  invalid: {
    ...e422,
    ...errors.identification.invalid("en")
  }
};

export const user = {
  invalid: {
    ...e422,
    ...errors.user.notFound("en")
  }
};

export const password = {
  invalid: {
    ...e422,
    ...errors.password.invalid("en")
  },
  wrong: {
    ...e422,
    ...errors.password.wrong("en")
  }
};

export const code = {
  invalid: {
    ...e422,
    ...errors.code.invalid("en")
  },
  wrong: {
    ...e422,
    ...errors.code.wrong("en")
  }
};
