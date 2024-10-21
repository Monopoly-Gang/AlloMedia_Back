const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
//     cb(null, file.fieldname + '-' + uniqueSuffix )
//   }
// })

// const upload = multer({ storage: storage })

function Upload(destinationPath) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Use the dynamic destination path
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

  // Return the configured multer instance
  return multer({ storage: storage });
}


module.exports = Upload;