import React, { useState, useEffect } from 'react';
import $ from 'jquery';

function App() {
  
  const [restaurantId, updateId] =  useState(1);
  const [photos, updatePhotos] = useState([]);
  const [visiblePhotos, updateVisbles] = useState([]);
  const [currentPhoto, updateCurrent] = useState(0);

  useEffect(() => {
    let newId = Math.floor(Math.random() * (100));
    updateId(newId);
  }, [])
  
  useEffect(() => {    
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
  }, [restaurantId])

  useEffect(() => {
    console.log('slice was updated')
    let visibleArray = photos.slice(currentPhoto, currentPhoto + 3)
    updateVisbles(visibleArray);
  }, [photos])

  return (
  <div>
    {visiblePhotos.map((photo) => {
      return <img src={photo.img}></img>
    })}
  </div>
  )

}

export default App;