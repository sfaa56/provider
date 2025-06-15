const Booking = require("../models/Booking");
const Offer = require("../models/Offer");
const Review = require("../models/Review");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const joi = require("joi");

const userValidationSchema = joi.object({
  _id:joi.string().optional(),
  id:joi.string().optional(),
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  phoneNumber: joi.string().required(),
  city: joi.string().optional(),
  region: joi.string().optional(),
  role: joi.string().valid("admin", "user").optional(),
  avatar:joi.string().optional(),
});

const getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

const updateUser = async (req, res) => {
  const userid = req.params.id
  const  user  = req.user;
  console.log("idddddd",userid)
  if (req.user.role !== "admin" && req.user.id !== userid) {
    return res.status(403).json({ message: "Access denied" });
  }
  try {

    const userToUpdate = await User.findById(user.id);

    if (!userToUpdate) {
      res.status(404).json({ message: "User not found" });
      return;
    }

   

    let img = "";
    if (req.body.file) {
      if (userToUpdate && userToUpdate.image && userToUpdate.image.publicId) {
        await cloudinary.uploader.destroy(userToUpdate.image.publicId);
      }

      const uploadResult = await cloudinary.uploader.upload(req.body.file, {
        folder: "user", // Optional: specify a folder in Cloudinary
      });

      img = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      };

      userToUpdate.image = img;
    }

    Object.assign(userToUpdate, req.body);

   const response = await userToUpdate.save();

    res.status(200).json(response);
  } catch (err) {
    console.log("err",err)
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete image from Cloudinary if it exists
    if (user.image && user.image.publicId) {
      await cloudinary.uploader.destroy(user.image.publicId);
    }

    // Delete related documents
    await Promise.all([
      Offer.deleteMany({ userId }),
      Booking.deleteMany({ userId }),
      Review.deleteMany({ userId }),
    ]);

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
