import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: "dhh725duh",
  api_key: "987737143587565",
  api_secret: "3vdWFG9rkyfa2t8bXLecPJuEzZE",
});
//CLOUDINARY
export const Image_Save = async (image, path) => {
  try {
    const { createReadStream } = await image;
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: path },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      createReadStream().pipe(uploadStream);
    });
  } catch (error) {
    return Promise.reject(error)
  }
};
//LOCAL
// export const Image_Save = async (image) => {

//   const { filename, mimetype, createReadStream } = await image;

//   const path = `public/img/${filename}`;
//   const stream = createReadStream();

//   return await new Promise((resolve, reject) =>
//     stream
//       .pipe(createWriteStream(path))
//       .on("finish", () => resolve({ path, filename, mimetype }))
//       .on("error", reject)
//   );
// };