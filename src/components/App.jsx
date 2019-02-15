import React, { useState, useEffect } from 'react';
import PhotoSet from './PhotoSet.jsx';

//takes about a second to transition and about every 5-8 seconds is when it does it.

function App() {
  const [restaurantId, updateId] =  useState(null); 
  const [photos, updatePhotos] = useState([]);
  const [prevPhotos, updatePrevs] = useState([]);
  const [currentPhotos, updateCurrents] = useState([]);
  const [nextPhotos, updateNexts] = useState([]);
  const [mainPhoto, updateMainPhoto] = useState(0);

  useEffect(() => { //Loads a random restaurant ID upon loading the page, will be replaced when all modules are comined
    let newId = Math.floor(Math.random() * (100));
    updateId(newId);
  }, []) //Runs every page load
  
  useEffect(() => { //Loads the photos from said restaurant Id, will be updated to not use jquery
    fetch(`/api/photo-gallery-list/${restaurantId}`)
      .then((restData) => {
        console.log('we did it!');
        return restData.json();
      })
      .then((data) => {
        console.log(data);
        updatePhotos(data.photos);
      })
      .catch((err) => {
        console.log('something went wrong', err);
      })
  }, [restaurantId]) //Only runs when restaurantId is updated

  useEffect(() => { //The array of all possibly visible photos
    console.log('photos were updated');
    updatePrevs(makePhotoArray(photos.length - 1));
    updateCurrents(makePhotoArray(0));
    updateNexts(makePhotoArray(1));
  }, [photos]) //updates when photos is updated so that these may render

  useEffect(() => {
    // debugger;
    console.log('i ran!')
    var timer = setTimeout(() => {
      // debugger;
      var reset = false;
      let currentView = document.getElementById('currentView');
      let nextView = document.getElementById('nextView');
      currentView.classList.replace('currentlyVisible', 'invisible')
      nextView.classList.replace('invisible', 'currentlyVisible')
      currentView.addEventListener("transitionend", (event) => {
        // debugger;
        // if (event.propertyName === 'opacity' && currentView.classList.contains('invisible')) {
        if (!reset) {
          reset = true;
          // debugger;
          currentView.style.transitionDuration = ".2s, 0s"; //Removing the transition
          nextView.style.transitionDuration = ".2s, 0s";
          currentView.innerHTML = '';
          for (var i = 0; i < 3; i++) {
            let elementToAdd = nextView.children[i].cloneNode(true); //replaces the photos from current with the ones from next behind the scenes
            currentView.appendChild(elementToAdd)
          }
          currentView.classList.replace('invisible', 'currentlyVisible'); //View changes back to the currentview div
          nextView.classList.replace('currentlyVisible', 'invisible')
          // debugger;
          shiftNext();
          // resetStyle(); // So when these arrays are replaced, currentview div does not suddenly shift to something else
        }
      });
    }, 5000);
    return () => {
      clearTimeout(timer); //This makes the timer stop in case this useEffect is called before it concludes
    }
  }, [mainPhoto, nextPhotos])

  useEffect(() => {
    resetStyle();
  }, [currentPhotos])
  
  
  function makePhotoArray(photoIndex) { //Makes an array of 3 photos to be visible via prev, current, or next
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
      shiftNext();
    } else {
      shiftBack();
    }
  }
  
  function resetStyle() {
    let currentView = document.getElementById('currentView');
    let nextView = document.getElementById('nextView');
    currentView.removeAttribute('style') 
    nextView.removeAttribute('style')
  }

  function shiftNext() {
    updatePrevs(currentPhotos);
    updateCurrents(nextPhotos);
    updateNexts(makePhotoArray((mainPhoto + 2) % photos.length))
    if (mainPhoto === photos.length - 1) {
      updateMainPhoto(0)
    } else {
      updateMainPhoto(mainPhoto + 1)
    }
  }

  function shiftBack() {
    updateNexts(currentPhotos);
    updateCurrents(prevPhotos);
    updatePrevs(makePhotoArray((photos.length + (mainPhoto - 2)) % photos.length))
    if (mainPhoto === 0) {
      updateMainPhoto(photos.length - 1);
    } else {
      updateMainPhoto(mainPhoto - 1);
    }
  }

  return (
  <div id="slideShowContainer">
    <div id="currentView" className="currentlyVisible">
      {currentPhotos.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}   
    </div>
    <div id="prevView" className="invisible">
      {prevPhotos.length === 3 && prevPhotos.map((photo, index) => { //for some reason, it won't do prevs on its own, so i added the conditional
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}
    </div>
    <div id="nextView" className="invisible">
      {nextPhotos.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
          )
      })}
    </div>
    <img className={`arrow prevArrow`} src='https://s3.amazonaws.com/yum-eats-photos/arrow.png' onClick={handleArrowClick}></img>
    <img className={`arrow nextArrow`} src='https://s3.amazonaws.com/yum-eats-photos/arrow.png' onClick={handleArrowClick}></img>
  </div>
  )
}

export default App;