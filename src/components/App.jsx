import React from 'react';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state =  {
      restaurantId: 1,
      photos: [],
      currentPhoto: 0,
    }

    this.storePhotos.bind(this);
  }

  storePhotos(photoSet) {
    this.setState({photos: photoSet})
  }

  componentDidMount() {
    let newId = Math.floor(Math.random() * (100));

    this.setState({
      restaurantId: newId
    }, () => {
      $.ajax({
        method: "GET",
        url: `/api/photo-gallery-list/${this.state.restaurantId}`,
        contentType: "application/json",
        success: (restData) => {
          console.log('we did it!');
          this.storePhotos(restData.photos);
        }, 
        error: (err) => {
          console.log('something went wrong', err);
        }
      })
    });

  }

  render() {
    return (
    <div>
      {this.state.photos.slice(this.state.currentPhoto, this.state.currentPhoto + 3).map((photo) => {
        return <img src={photo.img}></img>
      })}
    </div>
    )
  }
}

export default App;