import PngQuant from "pngquant";
import JpegTran from "jpegtran";
import FileType from "file-type";
import { photo } from "./errors";

const validMimes = ["image/png", "image/jpg", "image/jpeg"];

export default function makeUpdatePhotoController(app) {
  const {
    createError,
    validation: { error },
    storage: { profilePicture }
  } = app;

  return async function updatePhoto(ctx) {
    let fileName;
    const errorHandler = error => {
      if (error.expose) {
        return ctx.emit(error);
      }

      ctx.emit(
        createError(500, "Internal Server Error", {
          source: error
        })
      );
    };

    await ctx.busboy.finish({
      async file(field, uploadStream) {
        // prevent multiple file handling
        if (fileName) {
          return uploadStream.destroy();
        }

        fileName = `${ctx.user.data.id}.${Date.now()}.png`;

        uploadStream.on("error", errorHandler);

        const { mime } = await FileType.fromStream(uploadStream);

        if (validMimes.indexOf(mime) === -1) {
          return uploadStream.destroy(error(photo.invalid(ctx.language)));
        }

        let fileBytes = 0;
        uploadStream.on("data", chunk => {
          fileBytes += chunk.length;
          // 1mb size limit
          if (fileBytes > 1e6) {
            uploadStream.destroy(error(photo.limitSize(ctx.language)));
          }
        });

        const stream = profilePicture.bucket.file(fileName).createWriteStream({
          metadata: {
            contentType: mime
          },
          public: true,
          gzip: true,
          resumable: false
        });
        stream.on("error", errorHandler);

        const compressor =
          mime === "image/png"
            ? new PngQuant([256, "--quality", "75-85"])
            : new JpegTran();

        const compressStream = uploadStream.pipe(compressor);
        compressStream.on("error", errorHandler);
        compressStream.pipe(stream);
      }
    });

    const url = profilePicture.getPublicUrl(fileName);

    if (ctx.user.data.photo) {
      profilePicture.delete(ctx.user.data.photo).catch(e => {
        console.error("Failed to delete user old profile picture, error:", e);
      });
    }

    await ctx.user.update({ photo: url });

    return { code: 201, body: { url } };
  };
}
