import request from "supertest";
import app from "../app";

before(async () => {
  await app.start();
});

after(async () => {
  await app.close();
});

function anyInt(min = 0, max = 9) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rand = () => `${anyInt()}${anyInt()}${anyInt()}${anyInt()}`;

export const agent = () =>
  request.agent(`http://localhost:${app.server.info.port}`);

export const getToken = async () => {
  if (global.token) return global.token;
  const { body } = await agent()
    .post("/auth/sign")
    .field("id", "5582988704537")
    .field("pw", "123");

  return (global.token = body.token);
};

export const randomPhone = () => `558298870${rand()}`;

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
    error: "Unprocessable Entity"
  },
  406: {
    statusCode: 406,
    error: "Not Acceptable"
  },
  401: {
    statusCode: 401,
    error: "Unauthorized"
  },
  400: {
    statusCode: 400,
    error: "Bad Request"
  }
};
