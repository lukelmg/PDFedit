const express = require('express');
const fileUpload = require('express-fileupload');
const cryptoRandomString = require('crypto-random-string');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/upload', (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.image;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('public/upload/filename.jpg', (err) => {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
