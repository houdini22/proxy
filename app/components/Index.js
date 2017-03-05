import React from 'react';

import MainHeaderComponent from './header/Main';

class IndexComponent extends React.Component {
    render() {
        return (
            <div>
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    <div className="jumbotron">
                        <h1>ProxyAggregator</h1>
                        <p>Hello, world.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default IndexComponent;