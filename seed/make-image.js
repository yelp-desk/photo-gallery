let fs = require('fs');
request = require('request')
let path = '/Users/alex/Downloads/dummy-images (1)/';
console.log(path)

let sizeArray = [360, 480, 720, 1020];
let topicArray = ['cat', 'dog', 'food', 'lady', 'grass', 'baby', 'video-game', 'theater']


for (var i = 1; i <= 100; i++) { //This was just used once to populate a local directory.  I then uploaded those files into my S3 bucket.
  let a = sizeArray[Math.floor(Math.random() * sizeArray.length)];
  let b = sizeArray[Math.floor(Math.random() * sizeArray.length)];
  let c = topicArray[Math.floor(Math.random() * topicArray.length)];
  let url = `https://loremflickr.com/${a}/${a}/${c}`
  let newPath = path + `0${i}.jpg`
  console.log(a, b, url)
  request({uri: url})
    .pipe(fs.createWriteStream(newPath))
    .on('close', () => {
      console.log('yay');
    })
}
