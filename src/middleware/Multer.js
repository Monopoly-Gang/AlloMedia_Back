const fs = require('fs');
const path = require('path');
const multer = require('multer');


async function CreateFolder(destinationPath) {
  try {
    await fs.promises.mkdir(destinationPath, { recursive: true });
    // console.log('Folder created successfully');
  } catch (err) {
    console.error('Error creating folder', err);
    throw err;
  }
}


function Upload(destinationPath, filename) {
  return async (req, res, next) => {
    try {
      await CreateFolder(destinationPath);
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
      });

      const upload = multer({ storage: storage });

      upload.single(filename)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: 'Multer error', error: err.message });
        } else if (err) {
          return res.status(500).json({ message: 'Unknown error', error: err.message });
        }
        next();
      });

    } catch (error) {
      console.error('Error in Upload function', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
}

module.exports =  Upload ;
