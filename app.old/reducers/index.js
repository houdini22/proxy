import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import locationChangeReducer from './locationChange';
import statisticsReceived from './statisticsReceived';
import serversReceived from './serversReceived';
import sessionChanged from './sessionChanged';

const rootReducer = combineReducers({
    routing: routerReducer,
    currentPath: locationChangeReducer,
    statistics: statisticsReceived,
    servers: serversReceived,
    session: sessionChanged
});

export default rootReducer;