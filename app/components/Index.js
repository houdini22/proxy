import React from 'react';

import MainHeaderComponent from './header/Main';
import NewsComponent from './index/News';
import PromoBoxComponent from './index/PromoBox';

class IndexComponent extends React.Component {
    render() {
        return (
            <div className="page page-index">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <div className="row flex-parent">
                        <NewsComponent {...this.props}/>
                        <PromoBoxComponent {...this.props}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default IndexComponent;