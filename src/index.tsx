import React from 'react';
import { configureAxiosInterceptors } from './api/client';
import { initI18N } from './i18n';
import './logging';
import state from './state';
import './styles/index.scss';
import { App } from 'App';
import ReactDOM from 'react-dom';
import 'reflect-metadata';

configureAxiosInterceptors(state);
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
