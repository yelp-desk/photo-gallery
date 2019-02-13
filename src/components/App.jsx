import React, { useState, useEffect } from 'react';
import $ from 'jquery';

function App() {
  const [restaurantId, updateId] =  useState(null); 
  const [photos, updatePhotos] = useState([]);
  const [prevPhotos, updatePrevs] = useState([]);
  const [currentPhotos, updateCurrents] = useState([]);
  const [nextPhotos, updateNexts] = useState([]);
  const [mainPhoto, updateMainPhoto] = useState(0);
  const [expandedNum, updateExpandedNum] = useState(1);

  useEffect(() => { //Loads a random restaurant ID upon loading the page, will be replaced when all modules are comined
    let newId = Math.floor(Math.random() * (100));
    updateId(newId);
  }, []) //Runs every page load
  
  useEffect(() => { //Loads the photos from said restaurant Id
    $.ajax({
      method: "GET",
      url: `/api/photo-gallery-list/${restaurantId}`,
      contentType: "application/json",
      success: (restData) => {
        console.log('we did it!');
        updatePhotos(restData.photos);
      }, 
      error: (err) => {
        console.log('something went wrong', err);
      }
    })
  }, [restaurantId]) //Only runs when restaurantId is updated

  useEffect(() => { //The array of visible photos
    console.log('photos were updated');
    updatePrevs(makePhotoArray(photos.length - 1));
    updateCurrents(makePhotoArray(0));
    updateNexts(makePhotoArray(1));
  }, [photos]) //updates when photos is updated and when an arrow is clicked due to mainPhoto updating
  
  function makePhotoArray(photoIndex) {
    let photoArray;
    if (photoIndex === photos.length - 2) {
      photoArray = photos.slice(photoIndex, photoIndex + 2)
      photoArray.push(photos[0])
    } else if (photoIndex === photos.length - 1) {
      photoArray = [photos[photoIndex]]
      photoArray = photoArray.concat(photos.slice(0, 2))
    } else {
      photoArray = photos.slice(photoIndex, photoIndex + 3)
    }
    return photoArray;
  }

  function handleArrowClick(event) {
    if (event.target.className.includes('nextArrow')) {
      updatePrevs(currentPhotos);
      updateCurrents(nextPhotos);
      if (mainPhoto === photos.length - 2) { //I'm sure theres a way to make this shorter, but I'm having a hard time wrapping my head around it rn
        updateNexts(makePhotoArray(0));
      } else if (mainPhoto === photos.length - 1) {
        updateNexts(makePhotoArray(1));
      } else {
        updateNexts(makePhotoArray(mainPhoto + 2));
      }
      if (mainPhoto === photos.length - 1) {
        updateMainPhoto(0)
      } else {
        updateMainPhoto(mainPhoto + 1)
      }
    } else {
      updateNexts(currentPhotos);
      updateCurrents(prevPhotos);
      if (mainPhoto >= 2) { //ditto for line 60 
        updatePrevs(makePhotoArray(mainPhoto - 2));
      } else if (mainPhoto === 1) {
        updatePrevs(makePhotoArray(photos.length - 1));
      } else {
        updatePrevs(makePhotoArray(photos.length - 2));
      }
      if (mainPhoto === 0) {
        updateMainPhoto(photos.length - 1);
      } else {
        updateMainPhoto(mainPhoto - 1);
      }
    }
  }

  useEffect(() => {
    let new = document.getElementsByClassName(`photoContainer ${expandedNum}`)[0];
    if (main) {
      let old = document.getElementsByClassName('hoverEffect')[0];
      old.classList.toggle('hoverEffect');
      new.classList.toggle('hoverEffect');
    }
  }, [expandedNum, photos])

  function expandElement(event) {
    let photoNum = event.target.className;
    photoNum = photoNum.slice(photoNum.length - 1, photoNum.length);
    if (Number(photoNum) !== expandedNum) {
      console.log(photoNum);
      
      updateExpandedNum(Number(photoNum));
    }
  }

  function shrinkElement(event) {
    updateExpandedNum(1);
  }

  return (
  <div className="slideShowContainer">
    {currentPhotos.map((photo, index) => {
      let photoContainerClass = `photoContainer ${index}`
      if (index === 1) {
        photoContainerClass = photoContainerClass + ' hoverEffect'
      }
      return (
        <div className={photoContainerClass} onMouseEnter={expandElement} onMouseLeave={shrinkElement}>
          <div className={`imageContainer ${index}`}>
            <img className={`mainPhoto ${index}`} src={photo.img}></img>
          </div>
          <div className={`photoOverlay ${index}`}>
            <img className={`avatar ${index}`} src={photo.posterInfo.avatar}></img>
            <span className={`photoCaption ${index}`}>{photo.caption} by <strong className={`${index}`}>{photo.posterInfo.username}</strong></span>
          </div>
        </div>
      )
    })}
    <img className={`arrow prevArrow`} src='https://s3.amazonaws.com/yum-eats-photos/arrow.png' onClick={handleArrowClick}></img>
    <img className={`arrow nextArrow`} src='https://s3.amazonaws.com/yum-eats-photos/arrow.png' onClick={handleArrowClick}></img>
  </div>
  )
}

export default App;