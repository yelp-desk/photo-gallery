import React from 'react';
import Enzyme, { mount, render, shallow } from 'enzyme';
import jsdom from 'jsdom';
import sinon from 'sinon';
import App from '../src/components/App.jsx';
// import PhotoSet from '../src/components/PhotoSet.jsx';
import Adapter from 'enzyme-adapter-react-16';
// import renderer from 'react-test-renderer';
global.fetch = require('node-fetch');


Enzyme.configure({adapter: new Adapter})
// Components

let container;

// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   document.body.removeChild(container);
//   container = null;
// });

describe('App Tests', () => {

  test("successfully mounts App", () => {
    const wrapper = mount(<App />);
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
});

// describe('App renders', () => {
//   test("renders", () => {
//     const component = renderer.create(<App />);
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   })
// });

// describe('PhotoSet renders', () => {
//   test("renders", () => {
//     const wrapper = shallow(<PhotoSet />);
//     expect(wrapper.exists()).toBe(true)
//   })
// });