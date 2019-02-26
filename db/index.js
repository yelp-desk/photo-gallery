let mongoose = require('mongoose');

console.log('is this thing on?');

mongoose.connect('mongodb://172.17.0.2:27017/photo-gallery-container');

mongoose.connect('mongodb://localhost:27017/photo-gallery-container');


const PhotoSchema = new mongoose.Schema({
  img: String, /*a link to img on S3 server*/
  caption: String,
  date: Date, //Will order them by either this
  // helpfulRates: Number, //Or this
  // unhelpfulRates: Number,
  posterInfo: {
    avatar: String, //also to an img,
    username: String,
    // friends: Number,
    // stars: Number,
    // profile: String //link to profile
  },
});

const PhotoListSchema = new mongoose.Schema({ 
  restId: Number, //restaurant id, should be universal across all modules
  photos: [PhotoSchema] //The schema knows that each member in this array will have PhotoSchema's shape
});

const PhotoList = mongoose.model('PhotoList', PhotoListSchema);

const createList = (uploadList, callback) => {
  PhotoList.estimatedDocumentCount({}, (err, result) => { // No need for external counter variable
    if (err) {
      callback(err);
    } else {
      const count = result++ || 1;
      PhotoList.create({
        restId: result,
        photos: uploadList,
      }, addPhotos (uploadList, count, (err, result) => { 
        if (err) {
          console.log(err);
          callback(err);
        } else {
          callback(null, result);
        }
      })
      );  
    }
  });
}

let addPhotos = (photoObjs, id, callback) => {
  PhotoList.update (
    {restId: id},
    {"$push": {photos: {"$each": photoObjs}}}, // Adds any number of photos, be it 1 or 100 as long as it is in an array
    (err, result) => {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        callback(null, result);
      }
    }
  )
}

let grabPhotosFromOne = (id, callback) => {
  const query = PhotoList.findOne({"restId": id}); // Called at beginning of page load
  query.exec(callback);
}

let grabPhotosFromAll = (callback) => { // Really only used for testing that subsequent posts work properly
  const query = PhotoList.find({});
  query.exec(callback);
}

module.exports = {
  createList,
  addPhotos, 
  grabPhotosFromOne,
  grabPhotosFromAll,
  PhotoSchema,
  PhotoListSchema
}