import React from 'react';

import MainHeaderComponent from './header/Main';

class IndexComponent extends React.Component {
    render() {
        return (
            <div>
                <MainHeaderComponent {...this.props} />
                <div className="">
                    <p>INDEX</p>
                </div>
            </div>
        );
    }
}

export default IndexComponent;