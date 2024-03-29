import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default function verification(app) {
  const { cache, email, sms } = app;

  function get(id) {
    return cache.get("verificationCode", id);
  }

  async function create(id, to, renew) {
    if (!renew) {
      const existent = await get(id);

      if (existent) {
        return { created: existent.created };
      }
    }

    const { code, message, messageHTML } = make();

    const created = new Date().toString();
    await cache.set(
      "verificationCode",
      id,
      { to, code, created, confirmed: false, cpf: "" },
      60 * 15
    );

    const type = isValidEmail(to) ? "email" : "phone";

    if (app.isProduction) {
      await send(to, type, type === "email" ? messageHTML : message);
    }

    if (app.isDev) {
      console.log("Code:", code);
    }

    return {
      code,
      created
    };
  }

  async function send(to, type, content) {
    switch (type) {
      case "email":
        return email.send(to, content);
      case "phone":
        return sms.send(to, content);
      default:
        throw new Error(
          `Invalid verification send message method, is valid: "email" and "phone"; you provided: ${type}.`
        );
    }
  }

  function update(id, data) {
    return cache.update("verificationCode", id, data);
  }

  async function check(id, code) {
    const data = await get(id);

    if (!data || data.code !== code) {
      return false;
    }

    if (!data.confirmed) {
      await update(id, { confirmed: true });
    }

    return true;
  }

  function remove(id) {
    return cache.del("verificationCode", id);
  }

  function make() {
    const code = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0");

    const message = `Código de verificação do ${process.env.APP_NAME}:\n${code}`;
    const messageHTML = `
      <center>
        <img src="cid:guru-logo250.png" />
        <h1>Guru</h1>
        <br />
        <p>Seu código de verificação:</p>
        <br />
        <strong>${code}</strong>
      </center>
      <br>
      <p>Esse email é auto-gerado, não o responda.</p>
    `;

    return {
      code,
      message,
      messageHTML
    };
  }

  return { get, create, update, check, remove };
}
