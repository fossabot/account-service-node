import app from "../../";

export const countryCode = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: app.i18n.languages[lang]("InvalidCode")
  })
};

export const phone = {
  invalid: lang => ({
    statusCode: 422,
    code: "2",
    message: app.i18n.languages[lang]("InvalidNumber")
  }),
  inUse: lang => ({
    statusCode: 422,
    code: "3",
    message: app.i18n.languages[lang]("NumberInUse")
  })
};

export const code = {
  invalid: lang => ({
    statusCode: 422,
    code: "4",
    message: app.i18n.languages[lang]("InvalidCode")
  }),
  wrong: lang => ({
    statusCode: 422,
    code: "5",
    message: app.i18n.languages[lang]("WrongCode")
  })
};

export const cpf = {
  invalid: lang => ({
    statusCode: 422,
    code: "6",
    message: app.i18n.languages[lang]("InvalidFPIN")
  }),
  inUse: lang => ({
    statusCode: 422,
    code: "7",
    message: app.i18n.languages[lang]("InUseFPIN")
  })
};

export const birth = {
  invalid: lang => ({
    statusCode: 422,
    code: "8",
    message: app.i18n.languages[lang]("InvalidBirth")
  })
};

export const password = {
  invalid: lang => ({
    statusCode: 422,
    code: "9",
    message: app.i18n.languages[lang]("InvalidPassword")
  })
};

export const username = {
  invalid: lang => ({
    statusCode: 422,
    code: "10",
    message: app.i18n.languages[lang]("InvalidUsername")
  }),
  inUse: lang => ({
    statusCode: 422,
    code: "11",
    message: app.i18n.languages[lang]("InUseUsername")
  })
};

export const firstName = {
  invalid: lang => ({
    statusCode: 422,
    code: "12",
    message: app.i18n.languages[lang]("InvalidFirstName")
  })
};

export const lastName = {
  invalid: lang => ({
    statusCode: 422,
    code: "13",
    message: app.i18n.languages[lang]("InvalidLastName")
  })
};
