const db = require('../db/index.js');
let mongoose = require('mongoose');
const faker = require('faker');
const PhotoList = mongoose.model('PhotoList', db.PhotoListSchema);

(() => {
  let randomNum = (max, min = 1) => {
    max = max + 1
    return Math.floor(Math.random() * (max - min) + min);
  }
  let restaurants = [];
  let names = ['Troy Bolton', 'Gabriella Montez', 'Sharpay Evans', 'Ryan Evans', 'Chad Danforth', 'Taylor McKessie', 'Zeke Baylor', 'Kelsi Nielson']
  for (var i = 1; i <= 100; i++) {
    console.log(i);
    let maxPhotos = randomNum(75);
    let photosArray = [];
    for (var j = 0; j < maxPhotos; j++) {
      let obj = {
        img: `https://s3.amazonaws.com/photo-gallery-container/${randomNum(100).toString().padStart(3, '0')}.jpg`,
        caption: faker.random.words(),
        date: `${randomNum(12)}-${randomNum(31)}-${randomNum(19, 0)}`,
        helpfulRates: randomNum(100), 
        unhelpfulRates: randomNum(100),
        posterInfo: { 
          avatar: faker.image.avatar(),
          username: names[randomNum(names.length - 1, 0)],
          friends: randomNum(1000),
          stars: randomNum(1000),
          profile: faker.internet.url()
        },
      }
      photosArray.push(obj);
    }
    let restObj = {
      restId: i,
      photos: photosArray
    }
    restaurants.push(restObj);
  }
  PhotoList.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      PhotoList.insertMany(restaurants, (err, result) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log('done!');
          process.exit();
          return;
        }
      })
    }
  })
  return;
})()

