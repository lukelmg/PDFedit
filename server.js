const express = require('express');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const fileType = require('file-type');

const app = express();
const accepted_extensions = ['jpg', 'png', 'gif'];

app.use(express.static('public'));
app.use(fileUpload());

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
    let mime = fileType(req.files.data);
    if(!mime || !accepted_extensions.includes(mime.ext))
        return next(new Error('The uploaded file is not in ' + accepted_extensions.join(", ") + ' format!'));
    next();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/upload', upload.single('image'), validate_format, (req, res, next) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let upFile = req.files.image;
  console.log(req.files.image.md5);
  
  let id = req.files.image.md5
  
  // Use the mv() method to place the file somewhere on your server
  upFile.mv(`public/upload/${id}.jpg`, (err) => {
    if (err)
      return res.status(500).send(err);
    let html = `<!DOCTYPE html>Upload completed. Here's your image:<br><a href="/upload/${id}.jpg"><img src="/upload/${id}.jpg"><br>Make sure to copy and share the link!</a>`;
    res.send(html);
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
