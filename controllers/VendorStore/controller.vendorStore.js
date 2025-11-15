const VendorStore = require("../../models/VendorStore");
const Vendor = require("../../models/VendorRegistration");
const fs = require("fs");
const path = require("path");
const vendorStoreCreateSchema = require("../../validators/VendorStore/validator.vendorStore");
const vendorStoreUpdateSchema = require("../../validators/VendorStore/validator.updateVendorStore");


exports.getAllVendorStores = async (req, res) => {
  try {
    const stores = await VendorStore.find().populate("vendorId");
    res.json({ count: stores.length, stores });
  } catch (error) {
    console.log("GetAllStores Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};



exports.getVendorStoreById = async (req, res) => {
  try {
    const store = await VendorStore.findById(req.params.id).populate("vendorId");

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json(store);
  } catch (error) {
    console.log("GetStoreById Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.createVendorStore = async (req, res) => {
  try {
    let { storeAddress } = req.body;

    // Convert storeAddress string → real array
    if (storeAddress) {
      try {
        req.body.storeAddress =
          typeof storeAddress === "string"
            ? JSON.parse(storeAddress)
            : storeAddress;
      } catch (err) {
        return res.status(400).json({
          message: "storeAddress must be valid JSON array",
        });
      }
    }

    // Validate with Joi
    const { error } = vendorStoreCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { storeName, storeCategory, vendorId, gstNumber, companyName } = req.body;

    // Check if vendor exists
    const vendorExists = await Vendor.findById(vendorId);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if vendor already has a store
    const existingStore = await VendorStore.findOne({ vendorId });
    if (existingStore) {
      return res.status(400).json({ message: "Vendor already has a store" });
    }

    // Create new store
    const newStore = new VendorStore({
      storeName,
      storeCategory,
      storeAddress: req.body.storeAddress,
      vendorId,
      gstNumber,
      companyName,
      storeLogo: req.file ? req.file.filename : null,
    });

    await newStore.save();

    //  Update vendor profile with storeId
    vendorExists.storeId = newStore._id;
    await vendorExists.save();

    // Return response
    res.status(201).json({
      message: "Vendor store created successfully",
      store: newStore,
    });

  } catch (error) {
    console.log("CreateVendorStore Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateVendorStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    // ✅ Parse storeAddress first
    if (req.body.storeAddress) {
      try {
        req.body.storeAddress =
          typeof req.body.storeAddress === "string"
            ? JSON.parse(req.body.storeAddress)
            : req.body.storeAddress;
      } catch (err) {
        return res.status(400).json({
          message: "storeAddress must be valid JSON array",
        });
      }
    }

    // ✅ Joi validation
    const { error } = vendorStoreUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }

    // ✅ Check if store exists
    const store = await VendorStore.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    let updateData = { ...req.body };

    // ✅ Handle logo update
    if (req.file) {
      if (store.storeLogo) {
        const oldImgPath = path.join("public/uploads", store.storeLogo);
        if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
      }
      updateData.storeLogo = req.file.filename;
    }

    // ✅ Update store
    const updatedStore = await VendorStore.findByIdAndUpdate(
      storeId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.log("UpdateStore Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};




/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.partialUpdateVendorStore = async (req, res) => {
  try {
    const storeId = req.params.id;
    let updateData = req.body;

    const store = await VendorStore.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (req.file) {
      if (store.storeLogo) {
        const oldImg = path.join("public/uploads", store.storeLogo);
        if (fs.existsSync(oldImg)) fs.unlinkSync(oldImg);
      }
      updateData.storeLogo = req.file.filename;
    }

    if (updateData.storeAddress) {
      try {
        updateData.storeAddress = JSON.parse(updateData.storeAddress);
      } catch {
        return res.status(400).json({
          message: "storeAddress must be valid JSON format",
        });
      }
    }

    const updatedStore = await VendorStore.findByIdAndUpdate(
      storeId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Store partially updated",
      store: updatedStore,
    });
  } catch (error) {
    console.log("PartialUpdateStore Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteVendorStore = async (req, res) => {
  try {
    const store = await VendorStore.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // ✅ Delete logo file
    if (store.storeLogo) {
      const imgPath = path.join("public/uploads", store.storeLogo);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await VendorStore.findByIdAndDelete(req.params.id);

    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.log("DeleteStore Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
