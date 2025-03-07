const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloud");
require("dotenv").config();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles", // Cloudinary folder to store images
    format: async (req, file) => "png", // Or use file.mimetype.split("/")[1] for dynamic format
    public_id: (req, file) => "profile_" + Date.now(),
  },
});

const upload = multer({ storage });

console.log("Multer Cloudinary upload initialized"); // Debugging log

module.exports = { upload, cloudinary };
