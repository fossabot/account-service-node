export default function makeNexmoService() {
  const Nexmo = require("nexmo");
  const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
  });

  return {
    send(to, message) {
      return new Promise((resolve, reject) => {
        nexmo.message.sendSms(
          process.env.NEXMO_NUMBER,
          to,
          message,
          {},
          (err, data) => {
            if (err) return reject(err);

            resolve(data);
          }
        );
      });
    }
  };
}
