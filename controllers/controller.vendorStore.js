const VendorStore = require("../models/VendorStore");
const Vendor = require("../models/VendorRegistration");
const fs = require("fs");
const path = require("path");


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
    const {
      storeName,
      storeCategory,
      storeAddress,
      vendorId,
      gstNumber,
      companyName,
    } = req.body;

    // ✅ Validate required fields
    if (!storeName || !storeCategory || !vendorId) {
      return res.status(400).json({
        message: "storeName, storeCategory, and vendorId are required fields.",
      });
    }

    // ✅ Validate vendorId exists
    const vendorExists = await Vendor.findById(vendorId);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // ✅ Parse address if sent as JSON string (Postman form-data)
    let parsedAddress = [];
    if (storeAddress) {
      try {
        parsedAddress = JSON.parse(storeAddress);
      } catch (error) {
        return res.status(400).json({
          message: "storeAddress must be valid JSON format",
        });
      }
    }

    // ✅ Create the vendor store entry
    const newStore = new VendorStore({
      storeName,
      storeCategory,
      storeAddress: parsedAddress,
      vendorId,
      gstNumber,
      companyName,
      storeLogo: req.file ? req.file.filename : null, // multer file
    });

    await newStore.save();

    res.status(201).json({
      message: "Vendor store created successfully",
      store: {
        id: newStore._id,
        storeName: newStore.storeName,
        storeCategory: newStore.storeCategory,
        storeAddress: newStore.storeAddress,
        vendorId: newStore.vendorId,
        gstNumber: newStore.gstNumber,
        companyName: newStore.companyName,
        storeLogo: newStore.storeLogo ? `/uploads/${newStore.storeLogo}` : null,
      },
    });
  } catch (error) {
    console.log("CreateVendorStore Error:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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
    let updateData = req.body;

    const store = await VendorStore.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // ✅ Handle image replacement
    if (req.file) {
      if (store.storeLogo) {
        const oldImg = path.join("public/uploads", store.storeLogo);
        if (fs.existsSync(oldImg)) fs.unlinkSync(oldImg);
      }
      updateData.storeLogo = req.file.filename;
    }

    // ✅ Parse address if provided
    if (updateData.storeAddress) {
      try {
        updateData.storeAddress = JSON.parse(updateData.storeAddress);
      } catch {
        return res
          .status(400)
          .json({ message: "storeAddress must be valid JSON" });
      }
    }

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
