const express = require('express');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const fileType = require('file-type');

const app = express();

/* CONFIG */
const accepted_extensions = ['jpg', 'png', 'gif'];
const upload_folder = 'tmp';

app.use(express.static('public'));
app.use('/uploaded', express.static(upload_folder));
app.use(fileUpload({
  createParentPath: true
}));

const upload = multer({
  limits: { 
    fileSize: 5 * 1024 * 1024,  // 5 MB upload limit
    files: 1                    // 1 file
  },
  fileFilter: (req, file, cb) => {
    // if the file extension is in our accepted list
    if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
      return cb(null, true);
    }

    // otherwise, return error
    return cb(new Error('Only ' + accepted_extensions.join(", ") + ' files are allowed!'));
  }
});

// Middleware for validating file format
function validate_format(req, res, next) { 
  // If no files were selected
  if (!req.files) {
      return res.status(400).send('No files were uploaded.');
  };

  // Image/mime validation
  let mime = fileType(req.files.image.data);
  if(!mime || !accepted_extensions.includes(mime.ext))
    return next(res.status(500).send('The uploaded file is not in ' + accepted_extensions.join(", ") + ' format!'));
  next();
}

// Index get route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Upload post route
app.post('/upload', upload.single('image'), validate_format, (req, res, next) => {
  let upFile = req.files.image;
  let mime = fileType(req.files.image.data);
  
  // Use the mv() method to place the file somewhere on your server
  upFile.mv(`${upload_folder}/${upFile.md5}.${mime.ext}`, (err) => {
    if (err)
      return res.status(500).send(err);
    let html = `<!DOCTYPE html>Upload completed. Here's your image:<br><a href="/uploaded/${upFile.md5}.${mime.ext}"><img src="/uploaded/${upFile.md5}.${mime.ext}"><br>Make sure to copy and share the link!</a>`;
    res.send(html);
  });
});

// Server listener
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});