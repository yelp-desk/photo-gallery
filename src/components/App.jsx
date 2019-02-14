import React, { useState, useEffect } from 'react';
import $ from 'jquery';
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

  useEffect(() => { //The array of all possibly visible photos
    console.log('photos were updated');
    updatePrevs(makePhotoArray(photos.length - 1));
    updateCurrents(makePhotoArray(0));
    updateNexts(makePhotoArray(1));
  }, [photos]) //updates when photos is updated so that these may render

  useEffect(() => {
    var timer = setTimeout(() => {
      let reset = false;
      let currentView = document.getElementById('currentView');
      let nextView = document.getElementById('nextView');
      currentView.style.transitionDuration = "2s";
      nextView.style.transitionDuration = "2s";
      currentView.style.opacity = "0";
      nextView.style.opacity = "1";
      currentView.addEventListener("transitionend", (event) => {
        if (!reset) {
          reset = true;
          console.log(event.propertyName);
          currentView.style.transition = "ease 0s";
          nextView.style.transition = "ease 0s";
          // currentView.classList.toggle('noTransition');
          // nextView.classList.toggle('noTransition')
          // debugger;
          currentView.innerHTML = '';
          for (var i = 0; i < 3; i++) {
            let elementToAdd = nextView.children[i].cloneNode(true);
            currentView.appendChild(elementToAdd)
          }
          currentView.style.opacity = "initial";
          nextView.style.opacity = "0";
          // currentView.addEventListener()
          // currentView.classList.toggle('noTransition');
          // nextView.classList.toggle('noTransition')
          shiftNext();
        }
      });
    }, 4000);
    return () => {
      // resetOpacity();
      clearTimeout(timer);
    }
  }, [mainPhoto, nextPhotos])


  // useEffect(() => {
  //   resetOpacity();
  // }, [currentPhotos])

  // function resetOpacity() {
  //   let current = document.getElementById('currentView');
  //   current.classList.add('noTransition');
  //   current.style.opacity = "1";
  //   current.classList.remove('noTransition');
  //   let next = document.getElementById('nextView');
  //   next.classList.add('noTransition');
  //   next.style.opacity = "0";
  //   next.classList.remove('noTransition');
  // }
  
  
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
    <div id="currentView">
      {currentPhotos.map((photo, index) => {
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}   
    </div>
    <div id="prevView">
      {prevPhotos.length === 3 && prevPhotos.map((photo, index) => { //for some reason, it won't do prevs on its own, so i added the conditional
        return (
          <PhotoSet index={index} photo={photo}/>
        )
      })}
    </div>
    <div id="nextView">
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