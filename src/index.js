import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HolidayRenderer from './components/HolidayRenderer';
import TimerRemind from './components/TimerRemind';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <HolidayRenderer />
    <TimerRemind />
  </React.StrictMode>
);

reportWebVitals();
