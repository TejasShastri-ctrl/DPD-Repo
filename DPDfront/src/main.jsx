import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // No Routes here
import { Provider } from 'react-redux';
import { store } from './Redux/store';

import Root from './Pages/Root';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Root /> {/* Root handles all routing */}
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
