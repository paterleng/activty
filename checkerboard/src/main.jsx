import { createRoot } from 'react-dom/client'
import './index.css'
import './config/i18n.js'
import App from './App.jsx'
import { Provider } from 'react-redux'
import  {store,persistor} from './store/store.js';
import { Buffer } from 'buffer';
import {PersistGate} from "redux-persist/integration/react";
import StoryFive from "./components/story/StoryFive.jsx";
window.Buffer = Buffer;



createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        {/* PersistGate 会在持久化数据加载完毕后再渲染应用 */}
        <PersistGate loading={null} persistor={persistor}>
            <StoryFive />
            {/*<App />*/}
        </PersistGate>
    </Provider>,
)
