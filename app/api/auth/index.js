import identify from "./identify";
import credential from "./credential";
import code from "./code";
import unsign from "./unsign";

export default function loginSetup({ get, post, endpoint }) {
  get("/identify/:id", identify);
  post("/credential", credential);
  post("/code", code);
  endpoint("/unsign", unsign);

  /*
  
  get("/identify/:id", {
    schema: {
      response: {
        "200": {
          type: "object",
          properties: {
            fn: { type: "string" },
            photo: { type: "string" }
          }
        }
      }
    },
    handler: identify
  });

  const credentialSuccessSchema = {
    type: "object",
    properties: {
      content: { type: "string" }
    }
  };

  post("/credential", {
    schema: {
      response: {
        "200": credentialSuccessSchema,
        "201": credentialSuccessSchema
      }
    },
    handler: credential
  })

  */
}
