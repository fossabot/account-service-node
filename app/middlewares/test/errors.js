import { errors as errorsBases } from "../../../test/utils";
import * as authErrors from "../auth/errors";

const e422 = errorsBases[422];

export const invalidToken = {
  ...e422,
  ...authErrors.invalidToken
};

export const withoutPermission = {
  ...e422,
  ...authErrors.withoutPermission
};
