// src/redux/store.js
import { createStore } from 'redux';

// Action type
const TOKEN = 'token';

// Action creator
export const setToken = (token) => ({
    type: TOKEN,
    payload: token,
});

// Reducer
const initialState = {
    token: null,
};

const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        default:
            return state;
    }
};

// Create store
const store = createStore(tokenReducer);

export default store;
