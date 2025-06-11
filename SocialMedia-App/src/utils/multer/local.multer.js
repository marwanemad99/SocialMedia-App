import multer from "multer";
import { imageTypes } from "../../common/constants/index.js";
import path from 'node:path';
import fs from 'node:fs';
export const uploadFileDisk = (customPath = 'general') => {
  const basePath = `uploads/${customPath}`;
  const fullPath = path.resolve(`./src/${basePath}`);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const finalFileName = uniqueSuffix + "-" + file.originalname;
      file.finalPath = `${basePath}/${finalFileName}`;
      cb(null, finalFileName);
    },
  });

  function fileFilter(req, file, cb) {
    if (imageTypes.includes(file.mimetype.split("/")[1])) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, jpeg, png, gif and svg image files are allowed.'), false);
    }
  }
  return multer({ dest: 'tempPath', fileFilter, storage });
};


