import React from 'react';

import MainHeaderComponent from './header/Main';
import TableComponent from './Table';

class IndexComponent extends React.Component {
    componentDidMount() {
        this.props.ajax.get('/statistics').then((response) => {
            this.props.actions.statisticsReceived(response.data);
        });
    }

    render() {
        const statistics = this.props.state.statistics;

        return (
            <div className="page page-index">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-sm-12 col-xs-12 col-lg-6">
                            <div className="panel panel-info panel-statistics">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Statistics</h3>
                                </div>
                                <div className="panel-body">
                                    <table className="table table-condensed">
                                        <tbody>
                                        <tr>
                                            <th>Servers available in the past</th>
                                            <td><span className="label label-info">{statistics.nb_servers_available_in_past}</span></td>
                                        </tr>
                                        <tr>
                                            <th>Servers available today</th>
                                            <td><span className="label label-info">{statistics.nb_servers_available_today}</span></td>
                                        </tr>
                                        <tr>
                                            <th>Servers available past 15 minutes</th>
                                            <td><span className="label label-info">{statistics.nb_servers_available_past_15min}</span></td>
                                        </tr>
                                        <tr>
                                            <th>Distinct server countries</th>
                                            <td><span className="label label-info">{statistics.nb_server_countries}</span></td>
                                        </tr>
                                        <tr>
                                            <th>Distinct server cities</th>
                                            <td><span className="label label-info">{statistics.nb_server_cities}</span></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TableComponent {...this.props}/>
                </div>
            </div>
        );
    }
}

export default IndexComponent;