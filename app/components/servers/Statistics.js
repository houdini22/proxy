import React from 'react';
import {Link} from 'react-router';

class StatisticsComponent extends React.Component {
    render() {
        const statistics = this.props.state.statistics;

        return (
            <div className="full-container">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div className="small-box">
                                <div className="inner">
                                    <h3>{statistics.nb_servers_available_in_past}</h3>
                                    <p>servers online in the past</p>
                                </div>
                                <div className="icon">
                                    <i className=""></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
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
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
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
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div className="small-box">
                                <div className="inner">
                                    <h3>
                                        {statistics.nb_servers_socks5_online}
                                        &nbsp;/ {statistics.nb_servers_socks5_available}</h3>
                                    <p>SOCKS5 servers online</p>
                                </div>
                                <div className="icon">
                                    <i className=""></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div className="small-box">
                                <div className="inner">
                                    <h3>{statistics.nb_server_countries}</h3>
                                    <p>server countries</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-globe"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                            <div className="small-box">
                                <div className="inner">
                                    <h3>{statistics.nb_server_cities}</h3>
                                    <p>server cities</p>
                                </div>
                                <div className="icon">
                                    <i className=""></i>
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