import React from 'react';

import MainHeaderComponent from './header/Main';

class IndexComponent extends React.Component {
    render() {
        return (
            <div className="page page-about">
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    <div className="well">
                        Copyright by @hud
                    </div>
                </div>
            </div>
        );
    }
}

export default IndexComponent;