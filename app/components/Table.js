import React from 'react';

import MainHeaderComponent from './header/Main';

class TableComponent extends React.Component {
    componentDidMount() {
        this.autoRefresh = false;
        this.currentPage = 1;
        this.filtersOpened = false;
        this.filters = {};
        this.props.fetchServers(this.currentPage, this.filters);
    }

    componentWillUnmount() {
        clearInterval(this.autoRefreshInterval);
    }

    renderRow(obj, i) {
        let speed;
        let speedClassName;

        if (obj.is_checked_speed && obj.speed !== null) {
            speed = obj.speed;
            if (speed < 2048) {
                speedClassName = 'label label-warning';
            } else if (speed > 20480) {
                speedClassName = 'label label-success';
            } else {
                speedClassName = 'label label-info';
            }
            speed = `${speed} bytes / sec`;
        } else {
            speed = 'ERROR';
            speedClassName = 'label label-danger';
        }


        let pingClassName;
        if (obj.ping < 3) {
            pingClassName = 'label label-success';
        } else if (obj.ping > 20) {
            pingClassName = 'label label-warning';
        } else if (obj.ping > 40) {
            pingClassName = 'label label-danger'
        } else {
            pingClassName = 'label label-info';
        }

        let pingRatio = obj.ping_success / obj.ping_error;
        let pingRatioClassName;
        if (pingRatio > 0.75) {
            pingRatioClassName = 'label label-success';
        } else if (pingRatio < 0.25) {
            pingRatioClassName = 'label label-danger';
        } else {
            pingRatioClassName = 'label label-info';
        }

        let type;
        if (obj.is_socks) {
            type = 'SOCKS5 ';
        } else {
            type = 'HTTP ';
        }
        type += obj.type;

        return (
            <tr key={i}>
                <td style={{width: "160px"}}>
                    <img src={obj.address_img_url}/>
                </td>
                <td>{type}</td>
                <td><span className={pingClassName}>{obj.ping} sec</span></td>
                <td><span className={speedClassName}>{speed}</span></td>
                <td><span className={pingRatioClassName}>{obj.ping_success} / {obj.ping_error}</span></td>
                <td>{obj.country}</td>
                <td>{obj.city}</td>
                <td>{obj.checked_at}</td>
            </tr>
        );
    }

    handlePrevPageClick(e) {
        e.preventDefault();
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }
        this.props.fetchServers(this.currentPage, this.filters);
        this.props.fetchStatistics();
    }

    handleNextPageClick(e) {
        e.preventDefault();
        this.currentPage += 1;
        this.props.fetchServers(this.currentPage, this.filters);
        this.props.fetchStatistics();
    }

    handleButtonAutoRefreshClick(e) {
        e.preventDefault();
        this.autoRefresh = !this.autoRefresh;
        if (this.autoRefresh) {
            this.autoRefreshInterval = setInterval(() => {
                this.props.fetchServers(this.currentPage, this.filters);
                this.props.fetchStatistics();
            }, 30 * 1000);
        } else {
            clearInterval(this.autoRefreshInterval);
        }
        this.forceUpdate();
    }

    handleButtonFiltersClick(e) {
        e.preventDefault();
        this.filtersOpened = !this.filtersOpened;
        this.forceUpdate();
        this.props.fetchServers(this.currentPage, this.filters);
        this.props.fetchStatistics();
    }

    handleOnChangeFiltersInput(e) {
        const availability = this.filterAvailability.value;
        const type = this.filterType.value;

        const values = {
            availability,
            type
        };

        this.filters = values;

        this.props.fetchServers(this.currentPage, this.filters);
        this.props.fetchStatistics();
    }

    render() {
        let currentPage = this.props.state.servers.current_page || 0;
        let lastPage = this.props.state.servers.last_page || 0;
        let servers = this.props.state.servers.data || [];

        let playButtonClassNames;
        if (this.autoRefresh) {
            playButtonClassNames = "btn btn-danger btn-xs";
        } else {
            playButtonClassNames = "btn btn-success btn-xs";
        }

        let filterButtonClassNames = "btn btn-info btn-xs";
        if(this.filtersOpened) {
            filterButtonClassNames += " active";
        }

        return (
            <div className="row">
                <div className="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                    <div className="panel panel-info panel-table">
                        <div className="panel-heading">
                            <h3 className="panel-title">Servers</h3>
                            <div className="panel-tools">
                                <a
                                    href="#"
                                    className={playButtonClassNames}
                                    onClick={this.handleButtonAutoRefreshClick.bind(this)}
                                >
                                    <span className="glyphicon glyphicon-refresh"/>
                                    Auto-Refresh?
                                </a>
                                <a
                                    href="#"
                                    className={filterButtonClassNames}
                                    onClick={this.handleButtonFiltersClick.bind(this)}
                                >
                                    <span className="glyphicon glyphicon-filter"/>
                                    Filters
                                </a>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="filters" style={{display: this.filtersOpened ? 'block' : 'none'}}>
                                <form>
                                    <fieldset>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Availability</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterAvailability = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="online">Online</option>
                                                        <option value="offline">Offline</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Type</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterType = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="http_elite">HTTP elite</option>
                                                        <option value="http_anonymous">HTTP anonymous</option>
                                                        <option value="http_transparent">HTTP transparent</option>
                                                        <option value="socks5_elite">SOCKS5 elite</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">

                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <table className="proxy-table table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Type</th>
                                    <th>Ping</th>
                                    <th>Speed</th>
                                    <th>Ping Ratio</th>
                                    <th>Country</th>
                                    <th>City</th>
                                    <th>Checked at</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    servers.map((obj, i) => {
                                        return this.renderRow(obj, i);
                                    })
                                }
                                </tbody>
                            </table>
                            <nav>
                                <ul className="pagination">
                                    <li>
                                        <a href="#" onClick={this.handlePrevPageClick.bind(this)}>
                                            <span>&laquo;</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                        }}>
                                            <span>{currentPage} / {lastPage}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={this.handleNextPageClick.bind(this)}>
                                            <span>&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TableComponent;