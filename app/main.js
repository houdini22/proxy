import {render} from 'react-dom';

import "bootstrap/dist/css/bootstrap.css";
import "./scss/screen.scss";

import React from 'react';
import {Provider} from 'react-redux';
import store, {history} from './store';

import {Router, Route, IndexRoute} from 'react-router';

import IndexComponent from './components/Index';
import NotFoundComponent from './components/NotFound';
import AppComponent from './components/__App';

const router = (
    <Provider store={store}>
        <Router history={history} key={new Date()}>
            <Route component={AppComponent} path="/">
                <IndexRoute component={IndexComponent}/>
                <Route path="/about" component={IndexComponent}/>
                <Route path="*" component={NotFoundComponent}/>
            </Route>
        </Router>
    </Provider>
);

render(router, document.getElementById('main'));