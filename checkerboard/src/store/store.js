import { createStore,applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 使用 localStorage
import { createLogger } from 'redux-logger';

// Action types
const TOKEN = 'token';
const USER = 'user';

// Action creators
export const setToken = (token) => ({
    type: TOKEN,
    payload: token,
});

export const setUser = (user) => ({
    type: USER,
    payload: user,
});

// Initial state
const initialState = {
    token: null,
    user: null,
};

// Reducer
const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN:
            return {
                ...state,
                token: action.payload, // Store token
            };
        case USER:
            return {
                ...state,
                user: action.payload, // Store user data
            };
        default:
            return state;
    }
};

// Persist configuration
const persistConfig = {
    key: 'root', // Redux store key
    storage, // Use localStorage
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, Reducer);

// Create store with persisted reducer
const store = createStore(
    persistedReducer,
    applyMiddleware(createLogger()) // 可选：用于日志的中间件
);

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };
