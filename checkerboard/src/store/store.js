import { createStore,applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 使用 localStorage
import { createLogger } from 'redux-logger';

// Action types
const TOKEN = 'token';
const USER = 'user';
const PAGE = 'page';

// Action creators
export const setToken = (token) => ({
    type: TOKEN,
    payload: token,
});

export const setUser = (user) => ({
    type: USER,
    payload: user,
});

export const setPage = (page) => ({
    type:PAGE,
    payload:page,
})

const initialState = {
    token: null,
    user: null,
    page: 1,
};

// Reducer
const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        case USER:
            return {
                ...state,
                user: action.payload,
            };
        case PAGE:
            return {
                ...state,
                page: action.payload,
            };
        default:
            return state;
    }
};

const persistConfig = {
    key: 'root',
    storage,
};


const persistedReducer = persistReducer(persistConfig, Reducer);


const store = createStore(
    persistedReducer,
    applyMiddleware(createLogger())
);


const persistor = persistStore(store);

export { store, persistor };
