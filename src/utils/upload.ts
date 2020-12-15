import multer from "multer";
import fs from "fs";

const saveFolder = 'uploads'
if (!fs.existsSync(saveFolder)) {
  fs.mkdirSync(saveFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, saveFolder);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});

let upload = multer({
  storage: storage,
});

export default upload;