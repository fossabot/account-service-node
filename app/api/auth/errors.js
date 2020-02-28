export const identification = {
  invalid: {
    statusCode: 422,
    code: "1",
    message: "Invalid identification"
  }
};

export const user = {
  notFound: {
    statusCode: 404,
    code: "2",
    message: "User not found"
  }
};

export const password = {
  invalid: {
    statusCode: 422,
    code: "3",
    message: "Invalid password"
  },
  wrong: {
    statusCode: 422,
    code: "4",
    message: "Wrong password"
  }
};

export const code = {
  invalid: {
    statusCode: 422,
    code: "5",
    message: "Invalid code"
  },
  wrong: {
    statusCode: 422,
    code: "6",
    message: "Wrong code"
  }
};
