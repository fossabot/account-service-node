export default function makePlivoService() {
  const Plivo = require("plivo");
  const client = new Plivo.Client();

  return {
    send(to, message) {
      return client.messages.create(process.env.PLIVO_SENDER, to, message);
    }
  };
}
