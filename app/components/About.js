import React from 'react';

import MainHeaderComponent from './header/Main';

class IndexComponent extends React.Component {
    render() {
        return (
            <div>
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    About
                </div>
            </div>
        );
    }
}

export default IndexComponent;