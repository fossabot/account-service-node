import dotenv from "dotenv";
dotenv.config();

const frameworks = ["fastify", "koa"];

const {
  HTTP_FRAMEWORK,
  SMS_SERVICE_PROVIDER,
  TWILO_SID,
  TWILO_TOKEN,
  TWILO_SENDER,
  NEXMO_API_KEY,
  NEXMO_API_SECRET,
  NEXMO_SENDER
} = process.env;

if (frameworks.indexOf(HTTP_FRAMEWORK) === -1) {
  throw new TypeError(
    `Invalid http framework: ${HTTP_FRAMEWORK}; valids: ${frameworks}`
  );
}

function throwSMSServiceConfigError(service) {
  throw new TypeError(`${service} configuration not especified correctly`);
}

if (SMS_SERVICE_PROVIDER === "twillio") {
  if (!TWILO_SID || !TWILO_TOKEN || !TWILO_SENDER) {
    throwSMSServiceConfigError("Twillio");
  }
}

if (SMS_SERVICE_PROVIDER === "nexmo") {
  if (!NEXMO_API_KEY || !NEXMO_API_SECRET || !NEXMO_SENDER) {
    throwSMSServiceConfigError("Nexmo");
  }
}
