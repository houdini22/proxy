import React from 'react';
import {Link} from 'react-router';

class MainHeaderComponent extends React.Component {
    className(path) {
        if (this.props.state.currentPath === path) {
            return "active";
        }
        return "";
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">Proxy Aggregator</Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={this.className('/')}><Link to="/">Home</Link></li>
                            <li className={this.className('/about')}><Link to="/about">About</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default MainHeaderComponent;