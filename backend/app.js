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
            //console.log(`User ID: ${fetchUserID}`);
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

app.get('/searchfavorites/:favoriteids',function(req,res){

  //console.log("Searching item..")
  //console.log(req.params.favoriteids)
  //console.log(accestokenVar)
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

console.log("about to connect..")

let conn;
let db;
async function connectToMongo(user) {
  try {
    console.log("user id gekregen:", user)
    conn = await client.connect();
    console.log('Connected');
    db = conn.db("DevPortfolio");
    //Check if the user already exists in the DB
  let collection = await db.collection("Userdata");
   let result = await collection.findOne({"UserId" : {$regex : `${user}`}});
      if(!result){
      console.log("No result found - user does not excist yet")
        //Create the user now
      let addData = await collection.insertOne({
      UserId: user,
      favoriteTrack: []
      });
      //console.log(addData)
    }else{
      console.log("User already excists!")
      //console.log(result)
    }

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


//Sample request voor alle data op te laten (test)
app.get('/mongodb',async (req,res)=>{
  let collection = await db.collection("Userdata");
  let results = await collection.find({})
    .limit(50)
    .toArray();

  res.send(results).status(200);

})

//Sample request voor een userid op te halen (test)
app.get("/mongodb/:userid", async (req, res) => {
  let collection = await db.collection("Userdata");
  let result = await collection.findOne({"UserId" : {$regex : `${req.params.userid}`}});;
  if(!result){
    console.log("No result found - nothing yet favorited.")
    console.log(result)
    res.send("Noting yet favorited.")
  }else{
    console.log("User has favorites!")
    console.log(result)
    res.send(result)
  }
});

// Sample request voor een nieuwe track toe te voegen
app.post("/mongoPost/", async (req, res) => {
  console.log("posting request...")
  try{
    let collection = await db.collection("Userdata");
    let data = req.body;
    console.log(data)
    let result = await collection.insertOne(data);
    console.log("document inserted ", result)
    //res.sendStatus(201); // Send a "Created" status
  } catch (error) {
    console.error('Error:', error);
    //res.sendStatus(500); // Send a "Server Error" status
  } 
  
});

//Requeste voor een nieuw favorietje toe te voegen
app.post("/mongoAddFavorite/", async (req, res) => {
  console.log("posting request...")
  try{
    let collection = await db.collection("Userdata");
     let data = req.body;
     console.log(data)
     console.log(data.favoriteTrack)
    const trackID = data.favoriteTrack; 
    console.log(data);
    console.log(userID)
    const userdata = await collection.findOneAndUpdate(
      { UserId: `${userID}` },
      { $addToSet: { favoriteTrack: `${trackID}` } },
      { returnOriginal: false, upsert: true }
    );
    //console.log(userdata)
  } catch (error) {
    console.error('Error:', error);
  } 
  
});

//Request voor all favorite track ID's terug te geven
app.get('/mongoFavorites',async (req,res)=>{
  //console.log("mongo favorites called...")
  let collection = await db.collection("Userdata");
  const query={"UserId" : {$regex : `${userID}`}}
  let result = await collection.findOne(query);
  //console.log(result.favoriteTrack);
  res.send(result.favoriteTrack);

})

//Request voor een track te deleten uit favorites
app.delete("/mongoDelete/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  const collection = db.collection("posts");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});