import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './main.css';
import { ChamberMate } from './pages/Home';

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
    <HelmetProvider>
        <ChamberMate />
    </HelmetProvider>
);

export default ChamberMate;
