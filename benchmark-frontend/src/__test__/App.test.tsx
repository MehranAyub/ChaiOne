import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

it('renders without crashing', () => {
  // @ts-ignore
  fetch.resetMocks();

  // @ts-ignore
  fetch.mockResponseOnce(JSON.stringify( [] ));

  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});