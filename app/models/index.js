import { CDDB } from "cloud-doc-db";
import { Firestore } from "@google-cloud/firestore";

import UsersModel from "./users";
import sessions from "./sessions";

const env = process.env.NODE_ENV;

let firestore;

if (env === "production") firestore = new Firestore();
else {
  firestore = require("@firebase/testing")
    .initializeAdminApp({
      projectId: "firefast-unit-test"
    })
    .firestore();
}

export default function makeModels(app) {
  const storage = new CDDB({
    firestore
  });

  return {
    users: new UsersModel(storage, app),
    sessions: sessions(storage, app)
  };
}
