import { Storage } from "@google-cloud/storage";
import { MockStorage } from "../../test/mock-storage.js";

const PROFILE_BUCKET = process.env.PROFILE_PICTURES_BUCKET;
const PROFILE_URL = process.env.PROFILE_PICTURES_URL;

export default function storage(app) {
  const storage =
    process.env.NODE_ENV === "test"
      ? new MockStorage()
      : new Storage(
          !app.isProduction && {
            keyFilename: "gcloud-storage-dev-key.json"
          }
        );
  console.log("@", process.env.NODE_ENV, storage);
  return {
    profilePicture: {
      bucket: storage.bucket(PROFILE_BUCKET),
      getPublicUrl(filename) {
        return `${PROFILE_URL}/${PROFILE_BUCKET}/${filename}`;
      },
      delete(url) {
        const fileName = url.split("/").pop();
        return storage
          .bucket(PROFILE_BUCKET)
          .file(fileName)
          .delete();
      }
    }
  };
}
