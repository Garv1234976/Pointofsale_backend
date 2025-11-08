const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const VendorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    },

    phoneNumber: {
      type: String,
      required: true,
      maxlength: 10,
      minlength: 10,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // prevents password from showing in queries
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    profileImg: {
      type: String,
    },
  },
  { timestamps: true }
);

VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // salt rounds = 10
  next();
});

VendorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("VendorProfile", VendorSchema);
