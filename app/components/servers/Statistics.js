import React from 'react';
import {Link} from 'react-router';

class StatisticsComponent extends React.Component {
    render() {
        const statistics = this.props.state.statistics;

        return (
            <div className="row statistics-row">
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-globe"></i></span>
                        <div className="info-box-content">
                            <span className="info-box-text">All servers which were online</span>
                            <span className="info-box-number">{statistics.nb_servers_available_in_past}</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-clock-o"></i></span>
                        <div className="info-box-content">
                            <span className="info-box-text">Servers online within 24h</span>
                            <span className="info-box-number">{statistics.nb_servers_available_today}</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-clock-o"></i></span>
                        <div className="info-box-content">
                            <span className="info-box-text">Servers online within 15min</span>
                            <span className="info-box-number">{statistics.nb_servers_available_past_15min}</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-info"></i></span>
                        <div className="info-box-content">
                            <span className="info-box-text">SOCKS5 servers online</span>
                            <span className="info-box-number">{statistics.nb_servers_socks5_online} / <small>{statistics.nb_servers_socks5_available}</small></span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-map-marker"></i></span>
                        <div className="info-box-content">
                            <span className="info-box-text">Servers countries</span>
                            <span className="info-box-number">{statistics.nb_server_countries}</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-map-marker"></i></span>
                        <div className="info-box-content">
                            <span className="info-box-text">Servers cities</span>
                            <span className="info-box-number">{statistics.nb_server_cities}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatisticsComponent;