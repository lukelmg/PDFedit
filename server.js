const express = require('express');
const fileUpload = require('express-fileupload');
const multer = require('multer');
var hummus = require('hummus');
//var _ = require('lodash');
var extractText = require('./lib/text-extraction');

var run  = 0;
var e = 0;
var t = 0;

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
    console.log('validate')
  // If no files were selected
  if (!req.files) {
      return res.status(400).send('No files were uploaded.');
  };

  // Image/mime validation


  if(!mime || !accepted_extensions.includes('pdf'))
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

  console.log('got here')
  
  // Use the mv() method to place the file somewhere on your server

  upFile.mv(`${upload_folder}/current.pdf`, (err) => {
    if (err)
      return res.status(500).send(err);
    let html = `<!DOCTYPE html>Upload completed. Here's your image:<br><a href="/uploaded/current.${mime.ext}"><img src="/uploaded/${upFile.md5}.${mime.ext}"><br>Make sure to copy and share the link!</a>`;
    res.sendFile(__dirname + '/views/sent.html');
  });

  var fileToRun = './tmp/current.pdf';
  var pdfReader = hummus.createReader(fileToRun);

  var pagesPlacements = extractText(pdfReader);

  var pdfWriter = hummus.createWriterToModify(fileToRun,{modifiedFilePath:'./tmp/out.pdf'});
  for(var i=0;i<pagesPlacements.length;++i) {
      var pageModifier = new hummus.PDFPageModifier(pdfWriter,i);
      var cxt = pageModifier.startContext().getContext();
      pagesPlacements[i].forEach((placement)=> {
          if (placement.text == 'i' && pagesPlacements[i][e+1].text == 'n' && pagesPlacements[i][e+2].text == 'k') {
              cxt.q();
              cxt.drawRectangle(placement.matrix[4]-2, 782-placement.matrix[5], 30, 12,{color:'Red',width:2})
              cxt.Q();
              run++;
          }
          if (pagesPlacements[i][e].text == 't' && pagesPlacements[i][e+1].text == 'o' && pagesPlacements[i][e+2].text == 'n' && pagesPlacements[i][e+3].text == 'e' && pagesPlacements[i][e+4].text == 'r') {
              cxt.q();
              cxt.drawRectangle(placement.matrix[4]-2, 782-placement.matrix[5], 30, 12,{color:'Green',width:2})
              cxt.Q();
              run++;
          }
          e++;
      });
      e = 0;
      pageModifier.endContext().writePage();
  }
  pdfWriter.end();

});

// Server listener
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});