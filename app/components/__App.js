import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import MainComponent from './__Main';
import store from '../store';

function mapStateToProps(state) {
    return {
        state: {

        },
        store
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