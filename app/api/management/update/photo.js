import PngQuant from "pngquant";
import JpegTran from "jpegtran";
import FileType from "file-type";
import { photo } from "./errors";

const validMimes = ["image/png", "image/jpg", "image/jpeg"];

export default async function updatePhoto(ctx, app) {
  const upload = {};
  const errorHandler = error => {
    if (error.expose) {
      return ctx.emit(error);
    }

    ctx.emit(
      app.createError(500, "Internal Server Error", {
        source: upload.error
      })
    );
  };

  await ctx.busboy.finish({
    async file(field, stream) {
      // prevent multiple file handling
      if (upload.fileName) return;
      upload.fileName = `${ctx.user.data.id}.${Date.now()}.png`;
      stream.on("error", errorHandler);

      const { mime } = await FileType.fromStream(stream);

      if (validMimes.indexOf(mime) === -1) {
        return stream.destroy(
          app.createError(photo.invalid.statusCode, photo.invalid.message, {
            code: photo.invalid.code
          })
        );
      }

      let fileBytes = 0;
      stream.on("data", chunk => {
        fileBytes += chunk.length;
        // 1mb size limit
        if (fileBytes > 1e6) {
          stream.destroy(
            app.createError(
              photo.limitSize.statusCode,
              photo.limitSize.message,
              { code: photo.limitSize.code }
            )
          );
        }
      });

      upload.file = app.storage.profilePicture.bucket.file(upload.fileName);
      upload.publicUrl = app.storage.profilePicture.getPublicUrl(
        upload.fileName
      );

      upload.stream = upload.file.createWriteStream({
        metadata: {
          contentType: mime
        },
        public: true,
        gzip: true,
        resumable: false
      });
      upload.stream.on("error", errorHandler);

      const compressor =
        mime === "image/png"
          ? new PngQuant([256, "--quality", "75-85"])
          : new JpegTran();

      const compressStream = stream.pipe(compressor);
      compressStream.on("error", errorHandler);
      compressStream.pipe(upload.stream);
    }
  });

  if (ctx.user.data.photo) {
    app.storage.profilePicture.delete(ctx.user.data.photo).catch(e => {
      console.error("Failed to delete user old profile picture, error:", e);
    });
  }

  await ctx.user.update({ photo: upload.publicUrl });

  return { code: 201, body: { url: upload.publicUrl } };
}
