import * as languages from "../../../lib/i18n/languages";

export const names = {
  firstName: {
    invalid: lang => ({
      statusCode: 422,
      code: "1",
      message: languages[lang].errors.InvalidFirstName
    })
  },
  lastName: {
    invalid: lang => ({
      statusCode: 422,
      code: "2",
      message: languages[lang].errors.InvalidLastName
    })
  }
};

export const password = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: languages[lang].errors.InvalidPassword
  }),
  wrong: lang => ({
    statusCode: 422,
    code: "2",
    message: languages[lang].errors.WrongPassword
  })
};

export const auth = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: languages[lang].errors.InvalidContact
  }),
  notOwn: lang => ({
    statusCode: 422,
    code: "2",
    message: languages[lang].errors.NotContactOwner
  })
};

export const contact = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: languages[lang].errors.UndefinedAction
  }),
  code: {
    invalid: lang => ({
      statusCode: 422,
      code: "2",
      message: languages[lang].errors.InvalidCode
    }),
    wrong: lang => ({
      statusCode: 422,
      code: "3",
      message: languages[lang].errors.WrongCode
    })
  },
  item: {
    invalid: lang => ({
      statusCode: 422,
      code: "4",
      message: languages[lang].errors.InvalidContact
    }),
    add: {
      inUse: lang => ({
        statusCode: 422,
        code: "5",
        message: languages[lang].errors.ContactInUse
      })
    },
    remove: {
      single: lang => ({
        statusCode: 422,
        code: "6",
        message: languages[lang].errors.RemoveTheOnlyContact
      }),
      secondFactor: lang => ({
        statusCode: 422,
        code: "7",
        message: languages[lang].errors.RemoveSecondFactor
      })
    }
  }
};

export const photo = {
  invalid: lang => ({
    statusCode: 422,
    code: "1",
    message: languages[lang].errors.InvalidImageFormat
  }),
  limitSize: lang => ({
    statusCode: 422,
    code: "2",
    message: languages[lang].errors.ImageSizeLimitExceeded
  })
};
