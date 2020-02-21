import { isValidEmail } from "@brazilian-utils/brazilian-utils";

export default function verification(app) {
  const { cache, sms } = app;

  function get(id) {
    return app.cache.get("verificationCode", id);
  }

  async function create(to, renew) {
    if (!renew) {
      const existent = await get(to);

      if (existent) {
        return { created: existent.created };
      }
    }

    const { code, message, messageHTML } = make();

    if (process.env.NODE_ENV === "production") {
      if (isValidEmail(to)) {
        await sendEmail(to, messageHTML);
      } else {
        await sms.send(to, message);
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Code:", code);
    }

    const created = new Date().toString();
    await cache.set(
      "verificationCode",
      to,
      { to, code, created, confirmed: false, cpf: "" },
      60 * 15
    );

    return { created };
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

async function sendEmail(to, content) {}

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
