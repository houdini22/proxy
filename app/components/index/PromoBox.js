import React from 'react';
import {Link} from 'react-router';

class PromoBoxComponent extends React.Component {
    render() {
        return (
            <div className="flex-child">
                <div className="panel panel-warning panel-promo">
                    <div className="panel-heading">
                        <h3 className="panel-title">Get <strong>33% off</strong> price!</h3>
                    </div>
                    <div className="panel-body">
                        <div>
                            <div className="row text-center percent-row">
                                <span className="text-success">-33%</span>
                            </div>
                            <div className="row text-row">
                                <p>Soon we will provide a <strong>premium</strong> features such as:</p>
                                <ul>
                                    <li>No limit of pages</li>
                                    <li>No limit of filters</li>
                                    <li>Daily email notifications with last day online servers</li>
                                    <li>Export any table to *.txt or CSV format!</li>
                                </ul>
                                <div className="alert alert-success"><i className="glyphicon-info-sign glyphicon"/>
                                    Register right now to get 33% off for first 3 months.</div>
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