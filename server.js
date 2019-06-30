const express = require('express');
const fileUpload = require('express-fileupload');
const randomString = require('crypto-random-string');
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

  let upFile = req.files.image;
  
  // Make a random name for the file
  let id = randomString({length: 10});
  
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
