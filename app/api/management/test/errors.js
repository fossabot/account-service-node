import { errors as errorsBases } from "../../../../test/utils";
import * as errors from "../update/errors";

const err = errorsBases[422];

export const names = {
  ...err,
  ...errors.names.invalid
};

export const password = {
  invalid: {
    ...err,
    ...errors.password.invalid
  },
  wrong: {
    ...err,
    ...errors.password.wrong
  }
};

export const auth = {
  invalid: {
    ...err,
    ...errors.auth.invalid
  },
  notOwn: {
    ...err,
    ...errors.auth.notOwn
  }
};

export const contact = {
  invalid: {
    ...err,
    ...errors.contact.invalid
  },
  code: {
    invalid: {
      ...err,
      ...errors.contact.code.invalid
    },
    wrong: {
      ...err,
      ...errors.contact.code.wrong
    }
  },
  item: {
    invalid: {
      ...err,
      ...errors.contact.item.invalid
    },
    add: {
      inUse: {
        ...err,
        ...errors.contact.item.add.inUse
      }
    },
    remove: {
      single: {
        ...err,
        ...errors.contact.item.remove.single
      },
      secondFactor: {
        ...err,
        ...errors.contact.item.remove.secondFactor
      }
    }
  }
};

export const photo = {
  invalid: {
    ...err,
    ...errors.photo.invalid
  },
  limitSize: {
    ...err,
    ...errors.photo.limitSize
  }
};
