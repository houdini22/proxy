import React from 'react';
import {Link} from 'react-router';

class StatisticsComponent extends React.Component {
    render() {
        const statistics = this.props.state.statistics;

        return (
            <div className="full-container">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="small-box">
                                <div className="inner">
                                    <h3>{statistics.nb_servers_available_today}</h3>
                                    <p>servers online in the last 24h</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-clock-o"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="small-box">
                                <div className="inner">
                                    <h3>{statistics.nb_servers_available_past_15min}</h3>
                                    <p>servers online past 15 minutes</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-clock-o"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatisticsComponent;