import * as languages from "../../lib/i18n/languages";

export const identification = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: languages[lang].errors.InvalidIdentification
  })
};

export const user = {
  notFound: lang => ({
    statusCode: 404,
    code: "2",
    message: languages[lang].errors.UserNotFound
  })
};

export const password = {
  invalid: lang => ({
    statusCode: 422,
    code: "3",
    message: languages[lang].errors.InvalidPassword
  }),
  wrong: lang => ({
    statusCode: 422,
    code: "4",
    message: languages[lang].errors.WrongPassword
  })
};

export const code = {
  invalid: lang => ({
    statusCode: 422,
    code: "5",
    message: languages[lang].errors.InvalidCode
  }),
  wrong: lang => ({
    statusCode: 422,
    code: "6",
    message: languages[lang].errors.WrongCode
  })
};
