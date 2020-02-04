import twilio from "./twilio";
import nexmo from "./nexmo";

export default function() {
  switch (process.env.SMS_SERVICE_PROVIDER) {
    case "twilio":
      return twilio();
    case "nexmo":
      return nexmo();
  }
}
