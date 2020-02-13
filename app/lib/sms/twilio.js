export default function twilioService() {
  const Twilio = require("twilio");
  const twilio = new Twilio(process.env.TWILO_SID, process.env.TWILO_TOKEN);

  return {
    send(to, body) {
      return twilio.messages.create({
        from: process.env.TWILO_SENDER,
        to,
        body
      });
    }
  };
}
