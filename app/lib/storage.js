import { Storage } from "@google-cloud/storage";

const storage = Storage();
const PROFILE_BUCKET = process.env.PROFILE_PICTURES_BUCKET;
const PROFILE_URL = process.env.PROFILE_PICTURES_URL;

export default {
  profilePicture: {
    bucket: storage.bucket(PROFILE_BUCKET),
    getPublicUrl(filename) {
      return `${PROFILE_URL}/${PROFILE_BUCKET}/${filename}`;
    }
  }
};
