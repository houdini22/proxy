import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import MainComponent from './__Main';
import store from '../store';
import axios from 'axios';
import config from '../config';

let ajax = axios.create({
    baseURL: `${config.baseUrl}`
});

function mapStateToProps(state) {
    return {
        state: {
            currentPath: state.currentPath,
            statistics: state.statistics,
            servers: state.servers
        },
        store,
        ajax
    };
}

function mapDispatchToProps(dispatch) {
    let result = {actions: {}};
    Object.keys(actionCreators).forEach((key) => {
        result.actions[key] = bindActionCreators(actionCreators[key], dispatch);
    });
    return result;
}

const App = connect(mapStateToProps, mapDispatchToProps)(MainComponent);

export default App;