import { createRoot } from 'react-dom/client'
import './index.css'
import './config/i18n.js'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js';
import { Buffer } from 'buffer';
window.Buffer = Buffer;


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
