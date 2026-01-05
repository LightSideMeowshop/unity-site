import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from './lib/i18n';
import { UniTextPage } from './pages/UniTextPage';
import './styles/index.css';
import './styles/flags.css';

// Initialize i18n then render
initI18n().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <UniTextPage />
    </StrictMode>
  );
});
