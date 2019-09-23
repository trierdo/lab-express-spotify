require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node'); // requires spotify-web-api-node package

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });





// the routes go here:

app.get('/',  (req, res,next) => {
    res.render('index');

});

app.get('/artists', (req, res, next) => {
//res.send(Object.values(req.query)[0]); // Gibt mir die Parameter nochmal zurück. API aufrufen:
    spotifyApi
    .searchArtists(Object.values(req.query)[0])
    .then(data => {
      console.log("The received data from the API: ", data.body);
      console.log("my details I wanna know: ", data.body.artists.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    }); 

})

app.get('/albums/:artistId',  (req, res,next) => {
    
    spotifyApi.getArtistAlbums(req.params.artistId, {limit: 10, offset: 20}, function(err, data) { //artistId
        if (err) console.error(err);
        else {console.log('Artist albums', data);
        console.log('-----------', data.body.items[0]);
        res.render('albums',data.body);}
      });


   

});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
