import React from 'react';
import { initI18N } from './i18n';
import './logging';
import './styles/index.scss';
import { App } from 'App';
import ReactDOM from 'react-dom';

initI18N();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
