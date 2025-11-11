const express = require("express");
const upload = require("../../middleware/upload");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  partialUpdateProduct,
  deleteProduct,
} = require("../../controllers/Product/controller.product");
const verifyCsrf = require("../../security/verifyCsrf");
const router = express.Router();


router.post("/createProduct", verifyCsrf, upload.array("products[][image]", 50), createProduct);

router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);

router
  .route("/productsCrud/:id")
  .put(verifyCsrf, upload.array("image", 5), updateProduct)
  .patch(verifyCsrf,upload.array("image", 5), partialUpdateProduct)
  .delete(verifyCsrf,deleteProduct);
module.exports = router;
