const multer = require('multer');

const storageStr = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/Backend/upload/str_proof');
  },
  filename: function (req, file, cb) {
    const username = req.body.name;
    cb(null, `STR_PROOF_${username}_${Date.now()}.jpg`);
  },
});
const storageImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/Backend/upload/post_images');
  },
  filename: function (req, file, cb) {
    cb(null, `POST_IMAGES_${Date.now()}.jpg`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipe file tidak valid. Hanya file gambar yang diizinkan.'), false);
  }
};

const strProof = multer({ storageStr, fileFilter });
const postImage = multer({ storageImg, fileFilter });
module.exports = { strProof, postImage };
