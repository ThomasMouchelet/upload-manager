const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs');

const readline = require('readline');
const {google} = require('googleapis');

const app = express();
var globalDrive = "";

// initialisation socket io
const server = http.createServer(app);
const io = socketIO(server);
server.listen(4001, () => console.log(`Listening on port ${4001}`))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.post('/upload', (req, res, next) => {
  var imageFile = req.files.file;
  res.json({file: `public/uploads/${req.body.lastname}-${req.body.firstname}.${req.body.extend}`});

  var fileMetadata = {
    'name': `${req.body.lastname}-${req.body.firstname}.${req.body.extend}`,
    parents: ["1reGt8OUoifBeWp-r6X24g66kMRj5e2RL"] // id du parent à rendre dynamique
  };
  globalDrive.files.create({
    resource: fileMetadata,
    media: imageFile,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });

})

app.post('/files', (req, res, next) => {
  const testFolder = './public/uploads/';
  const fs = require('fs');
  var  array = [];

  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      array.push(file);
    })
    array.splice(0,1);
    res.json({files: array});
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listFiles(auth) {
  globalDrive = google.drive({version: 'v3', auth});
  globalDrive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    console.log(files)
    // 1jq9DWcPHIl4xEnX7jaDUe3fEnmBEqmB8
    // 1reGt8OUoifBeWp-r6X24g66kMRj5e2RL
    // var fileMetadata = {
    //   'name': 'kakakakakakakakak',
    //   'mimeType': 'application/vnd.google-apps.folder'
    // };
    // drive.files.create({
    //   resource: fileMetadata,
    //   fields: 'id'
    // }, function (err, file) {
    //   if (err) {
    //     // Handle error
    //     console.error(err);
    //   } else {
    //     console.log('Folder Id: ', file.id);
    //   }
    // });
  });
}

app.listen(8000, () => {
  console.log('8000');
});

module.exports = app;