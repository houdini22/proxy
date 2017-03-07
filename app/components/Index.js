import React from 'react';

import MainHeaderComponent from './header/Main';
import TableComponent from './Table';
import StatisticsComponent from './Statistics';

class IndexComponent extends React.Component {
    componentDidMount() {
        this.fetchStatistics();
    }

    fetchStatistics() {
        this.props.ajax.get('/statistics').then((response) => {
            this.props.actions.statisticsReceived(response.data);
        });
    }

    fetchServers(page = 1) {
        this.props.ajax.get('/servers', {
            params: {
                page: page
            }
        }).then((response) => {
            this.props.actions.serversReceived(response.data);
        });
    }

    render() {
        return (
            <div className="page page-index">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <StatisticsComponent {...this.props}/>
                    <TableComponent
                        {...this.props}
                        fetchStatistics={this.fetchStatistics.bind(this)}
                        fetchServers={this.fetchServers.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default IndexComponent;