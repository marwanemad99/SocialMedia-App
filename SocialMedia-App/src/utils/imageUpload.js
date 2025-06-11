import { cloud } from "./multer/cloudinary.multer.js";

export const uploadImage = async (req) => {
  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/user/${req.user._id}/profile` });
  return { secure_url, public_id };
};

export const uploadImages = async ({ req, path = '' } = {}) => {
  console.log({ folder: `${process.env.APP_NAME}/${path}` });
  
  const files = req.files.map(async (file) => {
    const { secure_url, public_id } = await cloud.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/${path}` });
    return { secure_url, public_id };
  });
  return Promise.all(files);
};

export const destroyImage = async (public_id) => {
  await cloud.uploader.destroy(public_id);
};