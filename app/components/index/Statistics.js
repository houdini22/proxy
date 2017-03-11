import React from 'react';

import MainHeaderComponent from '../header/Main';

class StatisticsComponent extends React.Component {
    render() {
        const statistics = this.props.state.statistics;

        return (
            <div className="flex-child">
                <div className="panel panel-primary panel-statistics">
                    <div className="panel-heading">
                        <h3 className="panel-title">Statistics</h3>
                    </div>
                    <div className="panel-body">
                        <table className="table table-condensed table-striped">
                            <tbody>
                            <tr>
                                <th>Servers online in the past</th>
                                <td><span
                                    className="label label-info">{statistics.nb_servers_available_in_past}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>Servers online today</th>
                                <td><span
                                    className="label label-info">{statistics.nb_servers_available_today}</span></td>
                            </tr>
                            <tr>
                                <th>Servers online past 15 minutes</th>
                                <td><span
                                    className="label label-info">{statistics.nb_servers_available_past_15min}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>SOCKS5 servers online</th>
                                <td>
                                    <span className="label label-info">
                                        {statistics.nb_servers_socks5_online}
                                        / {statistics.nb_servers_socks5_available}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>Servers countries</th>
                                <td><span className="label label-info">{statistics.nb_server_countries}</span></td>
                            </tr>
                            <tr>
                                <th>Servers cities</th>
                                <td><span className="label label-info">{statistics.nb_server_cities}</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatisticsComponent;