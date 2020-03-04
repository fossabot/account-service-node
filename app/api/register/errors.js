import * as languages from "../../lib/i18n/languages";

export const countryCode = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: languages[lang].errors.InvalidCode
  })
};

export const phone = {
  invalid: lang => ({
    statusCode: 422,
    code: "2",
    message: languages[lang].errors.InvalidNumber
  }),
  inUse: lang => ({
    statusCode: 422,
    code: "3",
    message: languages[lang].errors.NumberInUse
  })
};

export const code = {
  invalid: lang => ({
    statusCode: 422,
    code: "4",
    message: languages[lang].errors.InvalidCode
  }),
  wrong: lang => ({
    statusCode: 422,
    code: "5",
    message: languages[lang].errors.WrongCode
  })
};

export const cpf = {
  invalid: lang => ({
    statusCode: 422,
    code: "6",
    message: languages[lang].errors.InvalidFPIN
  }),
  inUse: lang => ({
    statusCode: 422,
    code: "7",
    message: languages[lang].errors.InUseFPIN
  })
};

export const birth = {
  invalid: lang => ({
    statusCode: 422,
    code: "8",
    message: languages[lang].errors.InvalidBirth
  })
};

export const password = {
  invalid: lang => ({
    statusCode: 422,
    code: "9",
    message: languages[lang].errors.InvalidPassword
  })
};

export const username = {
  invalid: lang => ({
    statusCode: 422,
    code: "10",
    message: languages[lang].errors.InvalidUsername
  }),
  inUse: lang => ({
    statusCode: 422,
    code: "11",
    message: languages[lang].errors.InUseUsername
  })
};

export const firstName = {
  invalid: lang => ({
    statusCode: 422,
    code: "12",
    message: languages[lang].errors.InvalidFirstName
  })
};

export const lastName = {
  invalid: lang => ({
    statusCode: 422,
    code: "13",
    message: languages[lang].errors.InvalidLastName
  })
};
