const express = require('express');
const app = express();
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config();
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(`Mongo Error: ${err}`));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/randomusers', (req, res) => {
    const url = 'https://randomuser.me/api/?results=20';

    fetch(url)
        .then((res) => res.json())
        .then((users) => {
            const sortAlphabetically = users.results.sort((a, b) => a.name.last.localeCompare(b.name.last))

            res.render('main/random', { sortAlphabetically });
        })
        .catch((err) => console.log(err));
});

app.get('/movies', (req, res) => {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}`;
    const img = 'https://image.tmdb.org/t/p/w185';
    
    fetch(url)
    .then((res) => res.json())
    .then((movies) => {
        const theMovies = movies.results
        res.render('main/movies', { theMovies, img })
    })
    .catch((err) => console.log(err))
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});