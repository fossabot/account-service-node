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
  const pw = await hash("123", 10);
  const result = await Promise.all(
    [
      {
        pw,
        fn: "nando",
        nbr: "5582988704537",
        cpf: "76759553072",
        birth: new Date("06/13/1994")
      },
      {
        pw,
        fn: "for",
        nbr: "5582988873646",
        cpf: "07226841002",
        birth: new Date("12/25/1988")
      }
    ].map(user => storage.set("users", user))
  );

  console.log("\nSeed result:");
  console.log(result);
  process.exit(0);
})();
