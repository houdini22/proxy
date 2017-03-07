import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import locationChangeReducer from './locationChange';
import statisticsReceived from './statisticsReceived';
import serversReceived from './serversReceived';

const rootReducer = combineReducers({
    routing: routerReducer,
    currentPath: locationChangeReducer,
    statistics: statisticsReceived,
    servers: serversReceived
});

export default rootReducer;