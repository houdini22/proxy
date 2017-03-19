import React from 'react';
import FooterComponent from './footer/Main';
import MainHeaderComponent from './header/Main';
import TableComponent from './servers/Table';
import StatisticsComponent from './servers/Statistics';

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
        let lastPage = this.props.state.servers.last_page || 0;
        this.currentPage = Math.min(this.currentPage + 1, lastPage);
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
                    <h3 className="page-header">Proxy List</h3>
                    <StatisticsComponent {...this.props}/>
                    <TableComponent
                        {...this.props}
                        goToPrevPage={this.goToPrevPage.bind(this)}
                        goToNextPage={this.goToNextPage.bind(this)}
                        refresh={this.refresh.bind(this)}
                        setFilters={this.setFilters.bind(this)}
                    />
                </div>
                <FooterComponent {...this.props}/>
            </div>
        );
    }
}

export default ServersComponent;