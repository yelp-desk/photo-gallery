import React from 'react';

class App extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      fileNames: ['https://s3.amazonaws.com/photo-gallery-container/elder-hacker.jpg',
       'https://s3.amazonaws.com/photo-gallery-container/horse-hacker.jpg',
       'https://s3.amazonaws.com/photo-gallery-container/skeleton-hacker.jpg']
    }
  }

  render() {
    return (
    <div>
      {this.state.fileNames.map((name) => {
        return <div class="hello">hey hi hello</div>
        // return <img src={name}/>
      })}
    </div>
    )
  }
}

export default App;