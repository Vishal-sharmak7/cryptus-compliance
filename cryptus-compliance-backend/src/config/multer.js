import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadPath = "uploads/companies";

    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);
  },
});

export default multer({ storage });