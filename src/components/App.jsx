import React, { useState, useEffect, useReducer } from 'react';
import PhotoSet from './PhotoSet.jsx';

//takes about a second to transition and about every 5-8 seconds is when it does it.


function App() {
  const initialState = {previous: [], current: [], next: [], mainPhoto: 0}
  function reducer (state, action) {
    console.log(state);
    let photoNum;
    switch (action.type) {
      case 'next':
        let array = makePhotoArray((state.mainPhoto + 2) % photos.length)
        console.log(array, 'hi');
        if (state.mainPhoto === photos.length - 1) {
          photoNum = 0
        } else {
          photoNum = state.mainPhoto + 1
        }
        return {
          previous: state.current,
          current: state.next,
          next: makePhotoArray((state.mainPhoto + 2) % photos.length),
          mainPhoto: state.mainPhoto + 1
        };
      case 'previous':
        if (state.mainPhoto === 0) {
          photoNum = photos.length - 1
        } else {
          photoNum = state.mainPhoto - 1
        }
        return {
          previous: makePhotoArray((photos.length + (state.mainPhoto - 2)) % photos.length),
          current: state.previous,
          next: state.current,
          mainPhoto: state.mainPhoto - 1
        };
      default:
        if (state.previous.length > 0 || photos.length === 0) {
          return state;
        } else {
          return {
            previous: makePhotoArray(photos.length - 1),
            current: makePhotoArray(0),
            next: makePhotoArray(1),
            mainPhoto: 0
          }
        }
    }
  }

  const [restaurantId, updateId] =  useState(null); 
  const [photos, updatePhotos] = useState([]);
  const [photosOfInterest, dispatch] = useReducer(reducer, initialState);

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
        updatePhotos(data.photos);
      })
      .catch((err) => {
        console.log('something went wrong', err);
      })
  }, [restaurantId]) //Only runs when restaurantId is updated

  useEffect(() => { //The array of all possibly visible photos
    console.log('photos were updated');
    dispatch({type: ''});
  }, [photos]) //updates when photos is updated so that these may render

  useEffect(() => {
    console.log('i ran!')
    let currentView = document.getElementById('currentView');
    let nextView = document.getElementById('nextView');
    var listener = (event) => {
      if (event.propertyName === 'opacity' && currentView.classList.contains('invisible')) {
        currentView.style.transitionDuration = ".2s, 0s"; //Removing the transition
        nextView.style.transitionDuration = ".2s, 0s";
        shiftNext();
        
      }
    }
    currentView.addEventListener("transitionend", listener);
    var timer = setInterval(() => {
      currentView.classList.replace('currentlyVisible', 'invisible')
      nextView.classList.replace('invisible', 'currentlyVisible')
    }, 5000);
    return () => {
      removeEventListener("transitionend", listener);
      clearInterval(timer); //This makes the timer stop in case this useEffect is called before it concludes
    }
  }, [])

  useEffect(() => {
    resetStyle();
  }, [photosOfInterest])
  
  
  function makePhotoArray(photoIndex) { //Makes an array of 3 photos to be visible via prev, current, or next
    let photoArray = [];
   
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
    dispatch({type: 'next'})
    currentView.classList.replace('invisible', 'currentlyVisible'); //View changes back to the currentview div
    nextView.classList.replace('currentlyVisible', 'invisible')
  }

  function shiftBack() {
    dispatch({type: 'previous'})
  }

  return (
  <div id="slideShowContainer">
    <div id="currentView" className="currentlyVisible">
      {photosOfInterest.current.length === 3 && photosOfInterest.current.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}   
    </div>
    <div id="prevView" className="invisible">
      {photosOfInterest.previous.length === 3 && photosOfInterest.previous.map((photo, index) => { //for some reason, it won't do prevs on its own, so i added the conditional
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}
    </div>
    <div id="nextView" className="invisible">
      {photosOfInterest.next.length === 3 && photosOfInterest.next.map((photo, index) => {
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