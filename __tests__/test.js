import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import ReactTestUtils from 'react-dom/test-utils'
import App from '../src/components/PhotoGalleryApp.jsx/index.js';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  getByTestId,
  getByLabelText
} from 'react-testing-library'

let container;

// jest.mock('global.fetch');

// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   document.body.removeChild(container);
//   container = null;
// });

afterEach(cleanup)

let photosArray = [];
for (var i = 1; i <= 5; i++) {
  let obj = { //generates random photos, with appropriate information
    img: `https://s3.amazonaws.com/yum-eats-photos/${(i).toString().padStart(3, '0')}.jpg`,
    caption: `caption ${i}`,
    date: `${1}-${i}-${1999}`,
    helpfulRates: i, 
    unhelpfulRates: i,
    posterInfo: { 
      avatar: `https://s3.amazonaws.com/yum-eats-photos/${(10 + i).toString().padStart(3, '0')}.jpg`,
      username: `user${i}`,
      friends: i,
      stars: i,
      profile: `https://s3.amazonaws.com/yum-eats-photos/${i.toString().padStart(3, '0')}.jpg`
    },
  }
  photosArray.push(obj)
}

let data = {
  restId: 1,
  photos: photosArray
}

it('work part 2', async () => {
  fetch.mockResponse(JSON.stringify(data));
  const {getByText, getByTestId, container, asFragment} = render(
    <PhotoGalleryApp />,
  );

  var gallery = await waitForElement(() => {
    container.querySelector('#slideShowContainer')
    // getById('slideShowContainer')
  }) 
  var currentView = await waitForElement(() => {
    container.querySelector('#currentView')
  }) 
  var prevView = await waitForElement(() => {
    container.querySelectorTestId('#prevView')
  }) 
  var nextView = await waitForElement(() => {
    container.querySelector('#nextView')
  }) 
  // const nextArrow = container.querySelector('.nextArrow')
  // const prevArrow = container.querySelector('.prevArrow')
  expect(gallery.children.length).not.toBe(0);
  expect(currentView.children.length).not.toBe(3);
  expect(prevView.children.length).not.toBe(3);
  expect(nextView.children.length).not.toBe(3);

})


// it('please work', () => {
//   // fetch = jest.fn(() => new Promise(resolve => resolve()));
//   // fetch.mockResolvedValue(data);
//   console.log(data);
//   act(() => {
//     fetch.mockResponse(JSON.stringify(data))
//     ReactDOM.render(<App />, container);
//   });

//   const gallery = container.querySelector('#slideShowContainer')
//   const currentView = container.querySelector('#currentView')
//   const prevView = container.querySelector('#prevView')
//   const nextView = container.querySelector('#nextView')
//   const nextArrow = container.querySelector('.nextArrow')
//   const prevArrow = container.querySelector('.prevArrow')
//   expect(gallery.children.length).not.toBe(0);
//   expect(currentView.children.length).not.toBe(3);
//   expect(prevView.children.length).not.toBe(3);
//   expect(nextView.children.length).not.toBe(3);

//   act(() => {
//     // nextArrow.dispatchEvent(new MouseEvent('click', {'bubbles': true}));
//     nextArrow.click();
//   });
// })


// let container;

// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   document.body.removeChild(container);
//   container = null;
// });

// it('can render and update a counter', () => {
//   // Test first render and componentDidMount
//   act(() => {
//     ReactDOM.render(<App />, container);
//   });
//   const button = container.querySelector('#slideShowContainer');
//   const label = container.querySelector('div');
//   expect(button.exists()).toBe('You clicked 0 times');
//   expect(document.title).toBe('You clicked 0 times');

//   // Test second render and componentDidUpdate
//   act(() => {
//     button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
//   });
//   expect(label.textContent).toBe('You clicked 1 times');
//   expect(document.title).toBe('You clicked 1 times');
// });