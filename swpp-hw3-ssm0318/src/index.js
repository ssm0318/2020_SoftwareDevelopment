import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import userReducer from './store/reducers/user';
import articleReducer from './store/reducers/article';
import commentReducer from './store/reducers/comment';

import 'bootstrap/dist/css/bootstrap.min.css';

const history = createBrowserHistory();

const rootReducer = combineReducers({
    usr: userReducer,
    atc: articleReducer,
    cm: commentReducer,
    router: connectRouter(history),
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer, 
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history))),
);

ReactDOM.render(<Provider store={store}><App history={history}/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
