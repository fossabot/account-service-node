export default {
  regex: {
    phone: /^55[1-9]{2}[6-9][1-9][0-9]{3}[0-9]{4}$/
  },
  makeVerifyCode() {
    const code = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, "0");

    const message = `Código do ${process.env.APP_NAME}:\n${code}`;

    return { code, message, created: new Date().toString() };
  }
};
