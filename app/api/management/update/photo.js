import PngQuant from "pngquant";

export default async function updatePhoto(
  { user, busboy }, // context
  { createError, storage, models } // app
) {
  const upload = {};
  const errorHandler = err => {
    upload.error = err;
  };

  await busboy.finish({
    file(field, stream, name, encoding, mimetype) {
      // prevent multiple file handling
      if (upload.fileName) return;
      upload.fileName = `${user.data.id}.${Date.now()}.png`;

      let fileBytes = 0;
      stream.on("error", errorHandler);
      stream.on("data", chunk => {
        fileBytes += chunk.length;
        // 3mb size limit
        if (fileBytes > 3e6) {
          stream.destroy(createError(400, "file size limit exceeded"));
        }
      });

      const quanter = new PngQuant([256, "--quality", "80-90"]);
      const quanterStream = stream.pipe(quanter);

      quanterStream.on("error", errorHandler);

      upload.file = storage.profilePicture.bucket.file(upload.fileName);
      upload.publicUrl = storage.profilePicture.getPublicUrl(upload.fileName);

      upload.stream = upload.file.createWriteStream({
        metadata: {
          contentType: mimetype
        },
        public: true,
        gzip: true,
        resumable: false
      });
      upload.stream.on("error", errorHandler);

      quanterStream.pipe(upload.stream);
    }
  });

  if (upload.error) {
    if (upload.error.statusCode) {
      throw createError(upload.error.statusCode, upload.error.message);
    }
    throw createError(500, "internal");
  }

  if (user.data.photo) {
    storage.profilePicture.delete(user.data.photo).catch(e => {
      console.error("Failed to delete user old profile picture, error:", e);
    });
  }

  await user.update({ photo: upload.publicUrl });

  return { content: { message: "ok", url: upload.publicUrl } };
}
