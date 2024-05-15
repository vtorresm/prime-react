import React from 'react';
import ReactDOM from 'react-dom/client';

import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import ThemeSwitcher from './components/themeSwitcher.tsx';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import './assets/index.css';
import './assets/flags.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <ThemeSwitcher />
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
