import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "/var/www/seclob/rubidya/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

export const upload = multer({ storage: storage });
