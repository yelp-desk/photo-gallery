// test.js
const {MongoClient} = require('mongodb');

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(global.__MONGO_URI__);
  db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
  await connection.close();
  await db.close();
});

it('should aggregate docs from collection', async () => {
  const files = db.collection('files');

  let photosArray = [];
  for (var i = 1; i <= 5; i++) {
    let obj = {
      img: `https://s3.amazonaws.com/yum-eats-photos/00${i}.jpg`, /*a link to img on S3 server*/
      caption: `caption${i}`,
      date: `3-${i}-1992`, //Will order them by either this
      helpfulRates: i, //Or this
      unhelpfulRates: i,
      posterInfo: {
        avatar: `https://s3.amazonaws.com/yum-eats-photos/0${i}${i}.jpg`, //also to an img,
        username: `user${i}`,
        friends: i,
        stars: i,
        profile: `https://s3.amazonaws.com/yum-eats-photos/0${i + 1}${i}.jpg` //link to profile
      }
    }
    photosArray.push(obj);
  }

  await files.insert({
    restId: 1,
    photos: photosArray
  });

  const topFiles = await files
    .aggregate([
      {$group: {_id: '$type', count: {$sum: 1}}},
      {$sort: {count: -1}},
    ])
    .toArray();

  expect(topFiles).toEqual([
    {_id: 'Document', count: 3},
    {_id: 'Image', count: 2},
    {_id: 'Video', count: 1},
  ]);
});