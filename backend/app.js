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
const { MongoClient } = require('mongodb');
const ColorThief = require('colorthief');
const fetch = require('cross-fetch');

/************vars for Spotify*****************/
const envPath = path.join(__dirname, '.env.local');
dotenv.config({ path: envPath });
let accestokenVar="";
let userID="";

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const uri = process.env.ATLAS_URI || "";


let fetchurl = `http://localhost:${port}`;
//http://127.0.0.1:${port}
//https://finalwork-26j6.onrender.com
//var redirect_uri = `${fetchurl}/`;
//var redirect_uri='http://localhost:3000/searchpage'
var redirect_uri = `${fetchurl}/callback`;



app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())
   .use(bodyParser.json());


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

        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        accestokenVar = access_token;
        
        //Get userID
      fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accestokenVar}`
            }
          })
          .then(response => response.json())
          .then(data => {
            const fetchUserID = data.id;
            userID=fetchUserID;
            //Connecting to the DB
            connectToMongo(userID);
          })

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

app.get('/searchfavorites/:favoriteids',function(req,res){

    var options = {
            url: `https://api.spotify.com/v1/tracks?ids=${req.params.favoriteids}`,
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


/*MONGO CONFIGURATION*/
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);


let conn;
let db;
async function connectToMongo(user) {
  try {
    conn = await client.connect();
    console.log('Connected to db');
    db = conn.db("DevPortfolio");
    //Check if the user already exists in the DB
  let collection = await db.collection("Userdata");
   let result = await collection.findOne({"UserId" : {$regex : `${user}`}});
      if(!result){
        //Create the user now
      let addData = await collection.insertOne({
      UserId: user,
      favoriteTrack: []
      });
    }else{
      
    }

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}



//Sample request voor een userid op te halen (test)
app.get("/mongodb/:userid", async (req, res) => {
  let collection = await db.collection("Userdata");
  let result = await collection.findOne({"UserId" : {$regex : `${req.params.userid}`}});;
  if(!result){
    res.send("Noting yet favorited.")
  }else{
    res.send(result)
  }
});


//Requeste voor een nieuw favorietje toe te voegen
app.post("/mongoAddFavorite/", async (req, res) => {
  try{
    let collection = await db.collection("Userdata");
     let data = req.body;
    const trackID = data.favoriteTrack; 
    const userdata = await collection.findOneAndUpdate(
      { UserId: `${userID}` },
      { $addToSet: { favoriteTrack: `${trackID}` } },
      { returnOriginal: false, upsert: true }
    );
  } catch (error) {
    console.error('Error:', error);
  } 
  
});

//Request voor all favorite track ID's terug te geven
app.get('/mongoFavorites',async (req,res)=>{
  let collection = await db.collection("Userdata");
  const query={"UserId" : {$regex : `${userID}`}}
  let result = await collection.findOne(query);
  res.send(result.favoriteTrack);

})

//Request voor een track te deleten uit favorites
app.delete("/mongoDelete/:trackID", async (req, res) => {
  const trackid=req.params.trackID;
  const collection = db.collection("Userdata");
  const userdata = await collection.findOneAndUpdate(
      { UserId: `${userID}` },
      { $pull: { favoriteTrack: `${trackid}` } },
      { returnOriginal: false, upsert: true }
    );
  
 // let result = await collection.deleteOne(query);

  res.json(userdata).status(200);
});



/*********************
 * Colorthief
 */


app.get('/dominantcolor/:imagelink', (req, res) => {
 try {
    const imageUrl = req.params.imagelink;
    ColorThief.getColor(imageUrl)
      .then((color) => {
        res.json({color});
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } catch (error) {
    console.error('Error:', error);
  }
})

