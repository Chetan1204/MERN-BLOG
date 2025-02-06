import multer from 'multer'
import fs from 'fs';
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file){
      cb(null, 'public/uploads/'); // Ensure the 'uploads/' directory exists
    }
  },
  filename: function (req, file, cb) {
    if(file){
      cb(null, file.originalname); // Save with the original filename
    }
  },
});

  function fileFilter(req, file, cb) {
    const allowedFiles = ['image/png', 'image/jpeg', 'image/webp'];
if(file){

  if (!allowedFiles.includes(file.mimetype)) {
    // Reject the file
    return cb(new Error('Only images are allowed'), false);
  }
}
    // Accept the file
    cb(null, true);
}

  const upload = multer({ storage: storage , fileFilter: fileFilter})

  export default upload 