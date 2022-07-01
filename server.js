const express = require('express');
const fileUpload = require('express-fileupload');
const multer = require('multer');

var hummus = require('hummus');
var extractText = require('./lib/text-extraction');

const app = express();

/* CONFIG */
const accepted_extensions = ['pdf'];
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
  next();
}

// Index get route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Upload post route
app.post('/upload', upload.single('image'), validate_format, (req, res, next) => {
  let upFile = req.files.image;
  
  // Use the mv() method to place the file somewhere on your server
  upFile.mv(`${upload_folder}/current.pdf`, (err) => {
    if (err)
      return res.status(500).send(err);
    let html = `<!DOCTYPE html>Upload completed. Here's your image:<br><a href="/uploaded/current.pdf"><img src="/uploaded/${upFile.md5}.pdf"><br>Make sure to copy and share the link!</a>`;
    res.sendFile(__dirname + '/views/sent.html');
  });
});

// Server listener
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});