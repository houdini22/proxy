import {LOCATION_CHANGE} from 'react-router-redux';

export default function locationChange(state = [], action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return action.payload.pathname;

        default:
            return state
    }
}