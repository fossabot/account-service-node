export default {
  regex: {
    phone: /^[1-9]{2}[6-9][1-9][0-9]{3}[0-9]{4}$/,
    phoneWithCountryCode: /^\+([1-9]{2})([1-9]{2})([6-9][1-9][0-9]{3})([0-9]{4})$/,
    username: /^[\w\d]{2,}[\w\d.]?[\w\d]$/,
    name: /^[A-ZÀ-Úa-zà-ú]{3,15}$/
    // phone: /^55[1-9]{2}[6-9][1-9][0-9]{3}[0-9]{4}$/
  },
  makeVerifyCode() {
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
      messageHTML,
      created: new Date().toString()
    };
  }
};
