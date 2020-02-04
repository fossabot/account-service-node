import { readFileSync } from "fs";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const verify = promisify(jwt.verify);
const sign = promisify(jwt.sign);

const privateKey = readFileSync("./certs/private.pem");
const publicKey = readFileSync("./certs/public.pem");
const passphrase = process.env.AUTH_RSA_PASSPHRASE;

export default {
  verify: token => verify(token, publicKey, { algorithms: ["RS256"] }),
  sign: data =>
    sign(
      data,
      { key: privateKey, passphrase },
      {
        algorithm: "RS256"
      }
    )
};
