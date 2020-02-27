import app from "../../index";

export const invalidId = () =>
  app.createError(422, "Invalid identification", { code: 1 });

export const userNotFound = () =>
  app.createError(404, "User not found", { code: 2 });

export const invalidPassword = () =>
  app.createError(422, "Invalid password", { code: 3 });

export const wrongPassword = () =>
  app.createError(422, "Wrong password", { code: 4 });

export const invalidCode = () =>
  app.createError(422, "Invalid code", { code: 5 });

export const wrongCode = () => app.createError(422, "Wrong code", { code: 6 });
