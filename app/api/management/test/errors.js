import { errors as errorsBases } from "../../../../test/utils";
import * as errors from "../update/errors";

const err = errorsBases[422];

export const names = {
  firstName: {
    ...err,
    ...errors.names.firstName.invalid("en")
  },
  lastName: {
    ...err,
    ...errors.names.lastName.invalid("en")
  }
};

export const password = {
  invalid: {
    ...err,
    ...errors.password.invalid("en")
  },
  wrong: {
    ...err,
    ...errors.password.wrong("en")
  }
};

export const auth = {
  invalid: {
    ...err,
    ...errors.auth.invalid("en")
  },
  notOwn: {
    ...err,
    ...errors.auth.notOwn("en")
  }
};

export const contact = {
  invalid: {
    ...err,
    ...errors.contact.invalid("en")
  },
  code: {
    invalid: {
      ...err,
      ...errors.contact.code.invalid("en")
    },
    wrong: {
      ...err,
      ...errors.contact.code.wrong("en")
    }
  },
  item: {
    invalid: {
      ...err,
      ...errors.contact.item.invalid("en")
    },
    add: {
      inUse: {
        ...err,
        ...errors.contact.item.add.inUse("en")
      }
    },
    remove: {
      single: {
        ...err,
        ...errors.contact.item.remove.single("en")
      },
      secondFactor: {
        ...err,
        ...errors.contact.item.remove.secondFactor("en")
      }
    }
  }
};

export const photo = {
  invalid: {
    ...err,
    ...errors.photo.invalid("en")
  },
  limitSize: {
    ...err,
    ...errors.photo.limitSize("en")
  }
};
