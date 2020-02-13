// import { createWriteStream } from "fs";
// import { extname } from "path";
import PngQuant from "pngquant";

// const validMimes = ["image/png", "image/jpeg"];

export default async function update(ctx, app) {
  const upload = {};
  const errorHandler = err => {
    console.error("Upload profile picture:", err);
    upload.error = true;
  };

  await ctx.busboy.finish({
    file(field, stream, name, encoding, mimetype) {
      stream.on("error", errorHandler);
      // const file = createWriteStream(`./${fileName}`);
      // const fileStream = createWriteStream(file.buffer);
      const quanter = new PngQuant([256, "--quality", "80-90"]);
      const quanterStream = stream.pipe(quanter);

      quanterStream.on("error", errorHandler);

      upload.fileName = `${ctx.user.id}.${Date.now()}.png`;
      upload.file = ctx.storage.profilePicture.bucket.file(upload.fileName);
      upload.publicUrl = ctx.storage.profilePicture.getPublicUrl(
        upload.fileName
      );

      upload.stream = upload.file.createWriteStream({
        metadata: {
          contentType: mimetype
        },
        gzip: true,
        resumable: false
      });

      quanterStream.pipe(upload.stream);

      upload.stream.on("error", errorHandler);
      /*
      fileStream.on("error", errorHandler);
      stream.on("error", errorHandler);
      .pipe(fileStream);
      // stream.pipe(file);
      */
    }
  });

  if (upload.error) {
    throw app.createError(
      upload.error.message ? 400 : 500,
      upload.error.message || "internal"
    );
  }
  await upload.file.makePublic();

  return { content: { message: "ok", picture_url: upload.publicUrl } };
}
