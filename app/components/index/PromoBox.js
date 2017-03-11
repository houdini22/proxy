import React from 'react';
import {Link} from 'react-router';

class PromoBoxComponent extends React.Component {
    render() {
        return (
            <div className="flex-child">
                <div className="panel panel-warning panel-promo">
                    <div className="panel-heading">
                        <h3 className="panel-title">Promotion! Get 33% off by registering now!</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="pull-left left-column">
                                <i className="fa fa-percent"/>
                            </div>
                            <div className="pull-right right-column">
                                <p>Soon we will provide an export feature with daily email notifications.</p>
                                <p>Register now to get 33% off for first 3 months. It's one month for free!</p>
                                <p className="btn-container">
                                    <Link to="/register" className="btn btn-xs btn-primary">Register now</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PromoBoxComponent;