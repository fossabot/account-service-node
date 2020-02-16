import { Storage } from "@google-cloud/storage";

const storage = new Storage(
  process.env.NODE_ENV !== "production" && {
    keyFilename: "gcloud-storage-dev-key.json"
  }
);
const PROFILE_BUCKET = process.env.PROFILE_PICTURES_BUCKET;
const PROFILE_URL = process.env.PROFILE_PICTURES_URL;

export default {
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
