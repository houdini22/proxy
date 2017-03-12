import {render} from 'react-dom';

import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap/dist/css/bootstrap-theme.css";
import "bootswatch/sandstone/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./scss/screen.scss";

import React from 'react';
import {Provider} from 'react-redux';
import store, {history} from './store';

import {Router, Route, IndexRoute} from 'react-router';

import IndexComponent from './components/Index';
import AboutComponent from './components/About';
import NotFoundComponent from './components/NotFound';
import AppComponent from './components/__App';
import AccountComponent from './components/Account';
import ProfileComponent from './components/Profile';

const router = (
    <Provider store={store}>
        <Router history={history} key={new Date()}>
            <Route component={AppComponent} path="/">
                <IndexRoute component={IndexComponent}/>
                <Route path="/about" component={AboutComponent}/>
                <Route path="/account" component={AccountComponent}/>
                <Route path="/profile" component={ProfileComponent}/>
                <Route path="*" component={NotFoundComponent}/>
            </Route>
        </Router>
    </Provider>
);

render(router, document.getElementById('main'));