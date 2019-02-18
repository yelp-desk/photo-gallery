import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from '../src/components/App.jsx';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from 'react-testing-library'

afterEach(cleanup)

test('please work', () => {
  const { getByText, getByTestId, container, asFragment } = render(
    <App />
  )
  
})


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