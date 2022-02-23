import React from 'react';
import { initI18N } from './i18n';
import './logging';
import './styles/index.scss';
import App from 'app';
import ReactDOM from 'react-dom';
import 'reflect-metadata';

initI18N();

if (!(window as any).__APP_INITIALIZED) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );
  (window as any).__APP_INITIALIZED = true;
}
