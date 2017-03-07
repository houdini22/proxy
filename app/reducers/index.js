import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import locationChangeReducer from './locationChange';
import statisticsReceived from './statisticsReceived';

const rootReducer = combineReducers({
    routing: routerReducer,
    currentPath: locationChangeReducer,
    statistics: statisticsReceived
});

export default rootReducer;