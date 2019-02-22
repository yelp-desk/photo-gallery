const express = require('express');
const bodyParser = require('body-parser');
const createList = require('../db/index.js').createList;
const addPhotos = require('../db/index.js').addPhotos;
const grabPhotosFromOne = require('../db/index.js').grabPhotosFromOne;
const grabPhotosFromAll = require('../db/index.js').grabPhotosFromAll;
const path = require('path');

const PORT = 3003;
const app = express();

app.use(express.static(path.join(__dirname, '/../dist')));

app.use(bodyParser.json());

app.post('/api/photo-gallery-list-add', (req, res) => { //Used to populate page, or, in a real scenario, creating a page's initial batch of photos
  createList(req.body, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  });
});

app.post('/api/photo-gallery-list-add/:restId', (req, res) => { //Probably won't be implemented on FDC, stretch goal
  addPhotos(req.body, req.params.restId, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/api/photo-gallery-list/:restId', (req, res) => { //The main bad boy to load initially
  grabPhotosFromOne(req.params.restId, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.json(result);
    }
  });
});

app.get('/api/photo-gallery-list', (req, res) => { //Just for testing subsequent posts
  grabPhotosFromAll((err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  });
});

app.get( '*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'))//`${__dirname}/../dist/index.html`)
});

app.listen(PORT, () => {
  console.log(`now listening on ${PORT}`)
}) 