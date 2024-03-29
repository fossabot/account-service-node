const { hash } = require("bcrypt");
const { CDDB } = require("cloud-doc-db");

const firestore = require("@firebase/testing")
  .initializeAdminApp({
    projectId: "firefast-unit-test"
  })
  .firestore();

const storage = new CDDB({
  firestore
});

(async function() {
  const pw = await hash("123456", 10);
  const result = await Promise.all(
    [
      {
        pw,
        fn: "nando",
        ln: "costa",
        username: "ferco1",
        access: 1,
        ncode: "55",
        phones: ["82988704537", "82988797979"],
        emails: ["ferco0@live.com"],
        cpf: "76759553072",
        authSecondFactor: false,
        birth: new Date("06/13/1994")
      },
      {
        pw,
        fn: "for",
        ln: "talia",
        username: "formiga",
        access: 1,
        ncode: "55",
        phones: ["82988873646"],
        emails: [],
        cpf: "07226841002",
        authSecondFactor: "+5582988873646",
        birth: new Date("12/25/1988")
      },
      {
        pw,
        fn: "fulan",
        ln: "beltran",
        username: "lanotrano",
        access: 1,
        ncode: "55",
        phones: ["82988873647"],
        emails: [],
        cpf: "09982118005",
        authSecondFactor: "+5582988873646",
        birth: new Date("12/25/1988")
      }
    ].map(user => storage.set("users", user))
  );

  console.log("\nSeed result:");
  console.log(result);
  process.exit(0);
})();
