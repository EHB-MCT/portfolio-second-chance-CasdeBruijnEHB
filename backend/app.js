const express = require('express');
const app = express();
const querystring = require('querystring');
const port = 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv'); // Import dotenv
const path = require('path');
const request = require('request');

/************vars for Spotify*****************/
const envPath = path.join(__dirname, '.env.local');
dotenv.config({ path: envPath });
let accestokenVar="";

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let fetchurl = `http://localhost:${port}`;
//http://127.0.0.1:${port}
//https://finalwork-26j6.onrender.com
//var redirect_uri = `${fetchurl}/`;
//var redirect_uri='http://localhost:3000/searchpage'
var redirect_uri = `${fetchurl}/callback`;



app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());


function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.get('/login', function(req, res) {
  console.log("login called.")
  var state = generateRandomString(16);
  var scope = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  console.log("callback called.")
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    
     request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("getting token..")
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        accestokenVar = access_token;

        res.redirect('http://localhost:3000/searchpage/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));


      } else {
        // Handle the error case
        res.status(response.statusCode).json(body);
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
 console.log("refresh token called.")
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/searchitem/:searchitem',function(req,res){

  console.log("Searching item..")
  console.log(req.params.searchitem)
  //console.log(accestokenVar)
    var options = {
            url: `https://api.spotify.com/v1/search?q=${req.params.searchitem}&type=track&limit=10`,
            headers: { 'Authorization': 'Bearer ' + accestokenVar },
            json: true
          };
          request.get(options, function(error, response, body) {
          if (error) {
            console.error(error);
            return;
            }
            if (response.statusCode !== 200) {
            console.error('Invalid status code:', response.statusCode);
            return;
            }
            res.json(body)
          });


})

app.get('/getaccess',function(req,res){

  res.send(accestokenVar)
})