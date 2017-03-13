import React from 'react';

import MainHeaderComponent from './header/Main';
import TableComponent from './servers/Table';
import StatisticsComponent from './servers/Statistics';
import FiltersComponent from './servers/Filters';

class ServersComponent extends React.Component {
    constructor() {
        super();
        this.filters = {};
        this.currentPage = 1;
    }

    refresh() {
        this.fetchStatistics();
        this.fetchServers(this.currentPage, this.filters);
    }

    componentDidMount() {
        this.refresh();
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

    setFilters(filters = {}) {
        this.filters = filters;
        this.currentPage = 1;
        this.fetchStatistics();
        this.fetchServers(this.currentPage, this.filters);
    }

    goToNextPage() {
        this.currentPage += 1;
        this.fetchServers(this.currentPage, this.filters);
    }

    goToPrevPage() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }
        this.fetchServers(this.currentPage, this.filters);
    }

    render() {
        return (
            <div className="page page-servers">
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    <div className="row flex-parent">
                        <StatisticsComponent {...this.props}/>
                        <FiltersComponent
                            {...this.props}
                            setFilters={this.setFilters.bind(this)}
                        />
                    </div>
                    <TableComponent
                        {...this.props}
                        goToPrevPage={this.goToPrevPage.bind(this)}
                        goToNextPage={this.goToNextPage.bind(this)}
                        refresh={this.refresh.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default ServersComponent;