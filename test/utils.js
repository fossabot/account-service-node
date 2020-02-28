import stRequest from "supertest";
import { expect } from "chai";
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
      },
      {
        pw,
        fn: "Origin",
        ln: "Vanilla",
        username: "vanilla",
        access: 1,
        ncode: "55",
        phones: ["82988873648"],
        emails: ["ferc@live.com"],
        cpf: "16096249043",
        authSecondFactor: "ferc@live.com",
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
  const { status, body } = await agent()
    .post("/auth/credential")
    .set("Content-Type", "application/json")
    .send({ id, pw: "123456" });
  let token;

  if (status === 200) {
    const { code } = await app.cache.get("verificationCode", id);
    const { body: bodyc } = await agent()
      .post("/auth/code")
      .set("Content-Type", "application/json")
      .send({ id, code });
    token = bodyc.content;
  } else {
    token = body.content;
  }

  global.token[id] = token;
  return global.token[id];
};

export const request = async (
  method,
  url,
  { auth = false, headers = {}, json, fields } = {}
) => {
  const token = await getToken();

  const ag = agent()[method](url);

  for (const header in headers) {
    ag.set(header, headers[header]);
  }

  auth && ag.set("authorization", auth === true ? token : auth);

  if (fields) {
    for (const field in fields) {
      ag.field(field, fields[field]);
    }
  }

  if (json) {
    ag.set("Content-Type", "application/json");
    ag.send(json);
  }

  return ag;
};

export function result(response, { "2xx": status2xx, "4xx": status4xx }) {
  const { status, body } = response;
  if (status2xx) {
    expect(status).to.be.eq(status2xx.code);

    if (status2xx.body) {
      for (const field in status2xx.body) {
        const value = status2xx.body[field];

        if (typeof value === "object" && typeof value.type === "string") {
          expect(body[field]).to.be.a(status2xx.body[field].type);
        } else {
          expect(body[field]).to.be.eq(status2xx.body[field]);
        }
      }
    }

    return response;
  }

  if (status4xx) {
    if (typeof result === "number") {
      expect(status).to.be.eq(result);
      return response;
    }

    expect(status).to.be.eq(status4xx.statusCode);
    expect(body).to.be.deep.eq(status4xx);

    return response;
  }
}

export const randomPhone = () => `8298870${rand()}`;

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
  404: {
    statusCode: 404,
    error: "Not Found",
    message: "Not Found"
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
