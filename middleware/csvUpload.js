const multer = require("multer");
const path = require("path");

// Storage for CSV files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/csv"); // ✅ create folder if needed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Allow only CSV
const csvFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() === ".csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

const csvUpload = multer({
  storage,
  fileFilter: csvFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = csvUpload;
