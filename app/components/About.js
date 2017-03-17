import React from 'react';
import FooterComponent from './footer/Main';
import MainHeaderComponent from './header/Main';

class IndexComponent extends React.Component {
    render() {
        return (
            <div className="page page-about">
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    <div className="well">
                        Copyright © 2017 proxydatabase.online
                    </div>
                </div>
                <FooterComponent {...this.props}/>
            </div>
        );
    }
}

export default IndexComponent;