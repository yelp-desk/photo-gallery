import React, { useState, useEffect, useReducer } from 'react';
import PhotoSet from './PhotoSet.jsx';

//takes about a second to transition and about every 5-8 seconds is when it does it.


function PhotoGalleryApp() {

  const initialState = {previous: [], current: [], next: [], mainPhoto: 0} 

  function reducer (state, action) { //reducer and initial state are required for creating a reduce hook
    let photoNum; //state always refers to the initialState object
    switch (action.type) { //switch is basically a fancy if statement
      case 'next': //basically this is if(action.type === 'next')
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
  const [stopwatch, updateWatch] = useState(false);

  useEffect(() => { //Loads a random restaurant ID upon loading the page, will be replaced when all modules are comined
    let newId = Math.floor(Math.random() * (100));
    updateId(newId);
  }, []) //Runs every page load
  
  useEffect(() => { //Loads the photos from said restaurant Id
    fetch(`http://localhost:3003/api/photo-gallery-list/${restaurantId}`)
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
    console.log('photos were updated', photos.length);
    dispatch({type: ''});
  }, [photos]) //updates when photos is updated so that these may render

  
  useEffect(() => { //This is creating the interval that causes fades
    let currentView = document.getElementById('currentView');
    let nextView = document.getElementById('nextView');
    var listener = (event) => { //This needs to happen after the transition ends
      if (event.propertyName === 'opacity' && currentView.classList.contains('invisible')) {
        removeTransition();
        shiftNext();
      }
    }
    currentView.addEventListener("transitionend", listener);
    var timer = setInterval(() => { //the interval of fading
      if (stopwatch) { //Since this hook updates with stopwatch, it checks to see if it should pause the interval
        clearInterval(timer);
      } else {
        currentView.classList.replace('currentlyVisible', 'invisible')
        nextView.classList.replace('invisible', 'currentlyVisible')
      }
    }, 7000);
    return () => { //This runs every time this hook is re-run.  Prevents doubling up on listener and timer
      removeEventListener("transitionend", listener);
      clearInterval(timer);
    }
  }, [stopwatch])

  useEffect(() => {
    resetStyle();
  }, [photosOfInterest]) //When photosOfInterest updates, it resets the transitions to normal so that the hover effect can be used.  Trust me, this is how it has to be
  
  function makePhotoArray(photoIndex) { //Makes an array of 3 photos to be visible via prev, current, or next
    let photoArray = [];
    let length = photos.length;
    photoArray = [photos[(length + photoIndex - 1) % length], 
                  photos[(length + photoIndex) % length],
                  photos[(length + photoIndex + 1) % length]]
    return photoArray;
  }

  function handleArrowClick(event) {
    if (event.target.className.includes('nextArrow')) {
      shiftNext();
    } else {
      shiftBack();
    }
  }

  function removeTransition() {
    let currentView = document.getElementById('currentView');
    let nextView = document.getElementById('nextView');
    currentView.style.transitionDuration = ".2s, 0s"; //Removing the transition
    nextView.style.transitionDuration = ".2s, 0s"; //this is reset in resetStyle()
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
    nextView.classList.replace('currentlyVisible', 'invisible'); //only here for the auto change
  }

  function shiftBack() {
    dispatch({type: 'previous'})
  }

  function pauseTimer() {
    updateWatch(true);
  }

  function restartTimer() {
    updateWatch(false);
  }


  return (
  <div id="slideShowContainer">
    <div id="currentView" className="currentlyVisible" onMouseEnter={pauseTimer} onMouseLeave={restartTimer}>
      {photosOfInterest.current.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}   
    </div>
    <div id="prevView" className="invisible" onMouseEnter={pauseTimer} onMouseLeave={restartTimer}>
      {photosOfInterest.previous.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}
    </div>
    <div id="nextView" className="invisible" onMouseEnter={pauseTimer} onMouseLeave={restartTimer}>
      {photosOfInterest.next.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
          )
      })}
    </div>
    <img className={`arrow prevArrow`} src='https://s3.amazonaws.com/yum-eats-photos/arrow.png' onClick={handleArrowClick} onMouseEnter={pauseTimer} onMouseLeave={restartTimer}></img>
    <img className={`arrow nextArrow`} src='https://s3.amazonaws.com/yum-eats-photos/arrow.png' onClick={handleArrowClick} onMouseEnter={pauseTimer} onMouseLeave={restartTimer}></img>
  </div>
  )
}

export default PhotoGalleryApp;