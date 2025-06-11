import multer from "multer";
import { imageTypes } from "../../common/constants/index.js";
export const uploadCloudFile = () => {

  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (imageTypes.includes(file.mimetype.split("/")[1])) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, jpeg, png, gif and svg image files are allowed.'), false);
    }
  }
  return multer({ dest: 'tempPath', fileFilter, storage });
};


