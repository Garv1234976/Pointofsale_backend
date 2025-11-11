const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/excel");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const excelFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".xlsx" || ext === ".xls") {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files (.xlsx, .xls) allowed"), false);
  }
};

const excelUpload = multer({
  storage,
  fileFilter: excelFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = excelUpload;
