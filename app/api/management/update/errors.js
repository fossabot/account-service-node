export const names = {
  firtName: {
    invalid: { statusCode: 422, code: "1", message: "Invalid first name" }
  },
  lastName: {
    invalid: { statusCode: 422, code: "2", message: "Invalid last name" }
  }
};

export const password = {
  invalid: { statusCode: 422, code: "1", message: "Invalid password" },
  wrong: { statusCode: 422, code: "2", message: "Wrong password" }
};

export const auth = {
  invalid: {
    statusCode: 422,
    code: "1",
    message: "Must be an email or mobile phone number"
  },
  notOwn: {
    statusCode: 422,
    code: "2",
    message: "Not owner of this contact"
  }
};

export const contact = {
  invalid: { statusCode: 422, code: "1", message: "Undefined action" },
  code: {
    invalid: { statusCode: 422, code: "2", message: "Invalid code" },
    wrong: { statusCode: 422, code: "3", message: "Wrong code" }
  },
  item: {
    invalid: { statusCode: 422, code: "4", message: "Invalid contact" },
    add: {
      inUse: { statusCode: 422, code: "5", message: "In use" }
    },
    remove: {
      single: {
        statusCode: 422,
        code: "6",
        message: "Can't remove the only contact method"
      },
      secondFactor: {
        statusCode: 422,
        code: "7",
        message: "Not allowed remove second factor authentication"
      }
    }
  }
};

export const photo = {
  invalid: {
    statusCode: 422,
    message: "Invalid format",
    code: "1"
  },
  limitSize: {
    statusCode: 422,
    message: "File size limit exceeded",
    code: "2"
  }
};
