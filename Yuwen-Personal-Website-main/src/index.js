import * as ReactDOMClient from 'react-dom/client';
import React from 'react';
import App from './App';
import './assets/fonts/Nunito/fonts.css';

const root = ReactDOMClient.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
