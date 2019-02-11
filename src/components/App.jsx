import React, { useState, useEffect } from 'react';
import $ from 'jquery';

function App() {
  
  const [restaurantId, updateId] =  useState(null); 
  const [photos, updatePhotos] = useState([]);
  const [visiblePhotos, updateVisbles] = useState([]);
  const [currentPhoto, updateCurrent] = useState(0);

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

  useEffect(() => { //The array of visible photos.  Will be used for clickign on arrows.
    console.log('slice was updated')
    let visibleArray = photos.slice(currentPhoto, currentPhoto + 3)
    updateVisbles(visibleArray);
  }, [photos]) //Right now, only updates when photos is updated.  Will also update when an arrow is clicked at some point

  return (
  <div className="slideShowContainer">
    {visiblePhotos.map((photo) => {
      return (
        <div className="photoContainer">
          <img src={photo.img}></img>
        </div>
      )
    })}
  </div>
  )

}

export default App;