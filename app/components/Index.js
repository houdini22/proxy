import React from 'react';

import MainHeaderComponent from './header/Main';
import TableComponent from './index/Table';
import StatisticsComponent from './index/Statistics';
import PromoBoxComponent from './index/PromoBox';

class IndexComponent extends React.Component {
    componentDidMount() {
        this.fetchStatistics();
    }

    fetchStatistics() {
        this.props.ajax.get('/statistics').then((response) => {
            this.props.actions.statisticsReceived(response.data);
        });
    }

    fetchServers(page = 1, filters = {}) {
        this.props.ajax.get('/servers', {
            params: {
                page,
                ...filters
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
                    <div className="row">
                        <StatisticsComponent {...this.props}/>
                        <PromoBoxComponent {...this.props}/>
                    </div>
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