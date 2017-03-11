import {createStore, compose} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import rootReducer from './reducers/index';
import {createHistory} from 'history'
import {useRouterHistory} from 'react-router'

const browserHistory = useRouterHistory(createHistory)({
    basename: '/proxy/'
});

const defaultState = {
    currentPath: '/',
    statistics: {},
    servers: {}
};

const store = createStore(rootReducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
