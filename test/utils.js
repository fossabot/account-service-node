import stRequest from "supertest";
import app from "../app";
import { hash } from "bcrypt";
const firebase = require("@firebase/testing");

global.token = {};

before(async () => {
  const pw = await hash("123456", 10);
  await Promise.all(
    [
      {
        pw,
        fn: "nando",
        ln: "costa",
        username: "ferco1",
        access: 1,
        ncode: "55",
        phones: ["82988704537", "82988797979"],
        emails: ["ferco0@live.com"],
        cpf: "76759553072",
        authSecondFactor: false,
        birth: new Date("06/13/1994")
      },
      {
        pw,
        fn: "for",
        ln: "talia",
        username: "formiga",
        access: 1,
        ncode: "55",
        phones: ["82988873646"],
        emails: ["user2@provider.com"],
        cpf: "07226841002",
        authSecondFactor: "+5582988873646",
        birth: new Date("12/25/1988")
      },
      {
        pw,
        fn: "fulan",
        ln: "beltran",
        username: "lanotrano",
        access: 1,
        ncode: "55",
        phones: ["82988873647"],
        emails: [],
        cpf: "43325320074",
        authSecondFactor: "+5582988873647",
        birth: new Date("12/25/1988")
      }
    ].map(user => app.models.users.set(user))
  );
  await app.start();
});

after(async () => {
  await app.close();
  await Promise.all(
    firebase.apps().map(app => {
      app.delete();
    })
  );
});

function anyInt(min = 0, max = 9) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rand = () => `${anyInt()}${anyInt()}${anyInt()}${anyInt()}`;

export const agent = () =>
  stRequest.agent(`http://localhost:${app.server.info.port}`);

export const getToken = async (id = "82988704537") => {
  if (global.token[id]) return global.token[id];
  const { body } = await agent()
    .post("/auth/credential")
    .field("id", id)
    .field("pw", "123456");
  let token;

  if (body.next) {
    const { code } = await app.cache.get("verificationCode", id);
    const { body: bodyc } = await agent()
      .post("/auth/code")
      .field("id", id)
      .field("code", code);
    token = bodyc.token;
  } else {
    token = body.token;
  }

  global.token[id] = token;
  return global.token[id];
};

export const request = async (
  method,
  url,
  fields = {},
  { auth = true, headers = {} } = {}
) => {
  const token = await getToken();
  const ag = agent()[method](url);

  for (const header in headers) {
    ag.set(header, headers[header]);
  }

  auth && ag.set("authorization", auth === true ? token : auth);

  for (const field in fields) {
    ag.field(field, fields[field]);
  }

  return ag;
};

export const randomPhone = () => `8298870${rand()}`;

// https://pt.stackoverflow.com/questions/244457/gerador-de-cpf-em-javascript
export const randomCPF = () => {
  const n1 = aleatorio();
  const n2 = aleatorio();
  const n3 = aleatorio();
  const d1 = dig(n1, n2, n3);
  return `${n1}${n2}${n3}${d1}${dig(n1, n2, n3, d1)}`;
};

function dig(n1, n2, n3, n4) {
  const nums = n1.split("").concat(n2.split(""), n3.split(""));

  let x = 0;
  if (n4) nums[9] = n4;
  for (let i = n4 ? 11 : 10, j = 0; i >= 2; i--, j++)
    x += parseInt(nums[j]) * i;
  const y = x % 11;
  return y < 2 ? 0 : 11 - y;
}

function aleatorio() {
  return ("" + Math.floor(Math.random() * 999)).padStart(3, "0");
}

export const errors = {
  422: {
    statusCode: 422,
    error: "Unprocessable Entity",
    message: "Unprocessable Entity"
  },
  406: {
    statusCode: 406,
    error: "Not Acceptable",
    message: "Not Acceptable"
  },
  401: {
    statusCode: 401,
    error: "Unauthorized",
    message: "Unauthorized"
  },
  400: {
    statusCode: 400,
    error: "Bad Request",
    message: "Bad Request"
  }
};
