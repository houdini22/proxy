import {render} from 'react-dom';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./scss/screen.scss";

import React from 'react';
import {Provider} from 'react-redux';
import store, {history} from './store';

import {Router, Route, IndexRoute} from 'react-router';

import IndexComponent from './components/Index';
import AboutComponent from './components/About';
import NotFoundComponent from './components/NotFound';
import AppComponent from './components/__App';

const router = (
    <Provider store={store}>
        <Router history={history} key={new Date()}>
            <Route component={AppComponent} path="/proxy/">
                <IndexRoute component={IndexComponent}/>
                <Route path="/about" component={AboutComponent}/>
                <Route path="*" component={NotFoundComponent}/>
            </Route>
        </Router>
    </Provider>
);

render(router, document.getElementById('main'));