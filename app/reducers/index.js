import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import locationChangeReducer from './locationChange';

const rootReducer = combineReducers({
    routing: routerReducer,
    currentPath: locationChangeReducer
});

export default rootReducer;