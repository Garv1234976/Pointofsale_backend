const express = require("express");
const multer = require("multer");
const upload = require("../../middleware/upload");
const verifyCsrf = require("../../security/verifyCsrf");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  partialUpdateProduct,
  deleteProduct,
} = require("../../controllers/Product/controller.product");

const router = express.Router();

// ✅ Enhanced Multer handler for better error messages
router.post(
  "/createProduct",
  verifyCsrf,
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "One or more images exceed the 5MB size limit.",
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            message: "Too many files uploaded. Maximum 10 allowed.",
          });
        }
        return res.status(400).json({ message: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      next(); // continue to controller if no errors
    });
  },
  createProduct
);

router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);

router
  .route("/productsCrud/:id")
  .put(verifyCsrf, upload.array("image", 5), updateProduct)
  .patch(verifyCsrf, upload.array("image", 5), partialUpdateProduct)
  .delete(verifyCsrf, deleteProduct);

module.exports = router;
