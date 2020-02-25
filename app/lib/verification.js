// import { isValidEmail } from "@brazilian-utils/brazilian-utils";

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

    return {
      code,
      created,
      send(type) {
        return app.isProduction
          ? send(type, to, type === "email" ? messageHTML : message)
          : app.isDev && console.log("Code:", code);
      }
    };
  }

  async function send(type, to, content) {
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

  async function check(id, code, confirmed) {
    const codeData = await get(id);
    const state = codeData && codeData.code === code;
    return confirmed ? state && codeData.confirmed : state;
  }

  async function confirm(id, code) {
    const codeData = await get(id);

    if (codeData && codeData.code === code) {
      await update(id, {
        confirmed: true
      });

      return true;
    }

    return false;
  }

  function remove(id) {
    return cache.del("verificationCode", id);
  }

  return { get, create, update, confirm, check, remove };
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
