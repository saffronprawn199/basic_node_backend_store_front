import multer from "multer"; // Import multer

// Configure multer storage (where to save files)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/"); // Create an 'uploads' folder
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop(),
    ); // Append file extension
  },
});

const upload = multer({ storage: storage }); // Create the multer instance

export default upload;
