import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store, { persistor } from './store/';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './components/theme/ThemeProvider.tsx';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SWRConfig>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </SWRConfig>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
