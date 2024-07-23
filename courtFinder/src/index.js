import React from 'react';
import ReactDOM from 'react-dom/client';
import IntroImage from './beginning';

const App = () => <h1>Hello, React!</h1>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IntroImage />
  </React.StrictMode>
);