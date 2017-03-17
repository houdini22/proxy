import React from 'react';
import {Link} from 'react-router';
import MainHeaderComponent from './header/Main';
import NewsComponent from './index/News';
import PromoBoxComponent from './index/PromoBox';
import FooterComponent from './footer/Main';

class IndexComponent extends React.Component {
    render() {
        return (
            <div className="page page-index">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <div className="jumbotron">
                        <h1>Welcome,</h1>
                        <h2>we are <strong>the largest</strong> proxy database in the internet!</h2>
                        <p>
                            In our database we have more than 3.5kk addresses and over 200k addresses marked as online
                            at least once.
                            <br/>
                            Check out our list and feel free to register to get even more options!
                        </p>
                        <p>
                            <Link to="/servers" className="btn btn-default btn-lg">
                                <i className="fa fa-server"></i>
                                Go to proxy list
                            </Link>
                        </p>
                    </div>
                    <div className="row flex-parent">
                        <NewsComponent {...this.props}/>
                        <PromoBoxComponent {...this.props}/>
                    </div>
                </div>
                <FooterComponent {...this.props}/>
            </div>
        );
    }
}

export default IndexComponent;