// Declare our dependencies
var express = require('express');
var request = require('superagent');

// Create our express app
var app = express();

// Set the view engine to use EJS as well as set the default views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

// This tells Express out of which directory to serve static assets like CSS and images
app.use(express.static(__dirname + '/public'));

// These two variables we’ll get from our Auth0 MovieAnalyst-Website Client.
// Head over the the management dashboard at https://manage.auth0.com
// Find the MovieAnalyst Website Client and copy and paste the Client ID and Secret
var NON_INTERACTIVE_CLIENT_ID = 'YbyHR5BHgg7i8eGIReM6a08t2bmkGqZ4';
var NON_INTERACTIVE_CLIENT_SECRET = 'aSmAtcoYIvMs1pGh_Wadq38RKxTVFFKTEnR_Rs7IZUyYXLqv7ZbkkUjL1n6IyFw7';
// Next, we’ll define an object that we’ll use to exchange our credentials for an access token.
var authData = {
    client_id: NON_INTERACTIVE_CLIENT_ID,
    client_secret: NON_INTERACTIVE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: 'http://movieanalyst.com'
}

// First, authenticate this client and get an access_token
// This could be cached
function getAccessToken(req, res, next){
    request
        .post('https://webegg.eu.auth0.com/oauth/token')
        .send(authData)
        .end(function(err, res) {
            req.access_token = res.body.access_token
            next();
        })
}


app.get('/', function(req, res){
    res.render('index');
})

app.get('/movies', getAccessToken, function(req, res){
    request
        .get('http://localhost:8080/movies')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function(err, data) {
            console.log(data);
            if(data.status == 403){
                res.send(403, '403 Forbidden');
            } else {
                var movies = data.body;
                res.render('movies', { movies: movies} );
            }
        })
})

app.get('/authors', getAccessToken, function(req, res){
    request
        .get('http://localhost:8080/reviewers')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function(err, data) {
            if(data.status == 403){
                res.send(403, '403 Forbidden');
            } else {
                var authors = data.body;
                res.render('authors', {authors : authors});
            }
        })
})

app.get('/publications', getAccessToken, function(req, res){
    request
        .get('http://localhost:8080/publications')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function(err, data) {
            if(data.status == 403){
                res.send(403, '403 Forbidden');
            } else {
                var publications = data.body;
                res.render('publications', {publications : publications});
            }
        })
})

app.get('/pending', getAccessToken, function(req, res){
    request
        .get('http://localhost:8080/pending')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function(err, data) {
            if(data.status == 403){
                res.send(403, '403 Forbidden');
            } else {
                var movies = data.body;
                res.render('pending', {movies : movies});
            }
        })
})

app.listen(4000);