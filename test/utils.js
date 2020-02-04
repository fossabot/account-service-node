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
