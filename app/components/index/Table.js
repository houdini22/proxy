import React from 'react';
import TableRowComponent from './TableRow';
import TablePaginationComponent from './TablePagination';

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
        const ping = this.filterPing.value;
        const speed = this.filterSpeed.value;
        const uptime_ratio = this.filterUptimeRatio.value;
        const country = this.filterCountry.value;

        const values = {
            availability,
            type,
            ping,
            speed,
            uptime_ratio,
            country
        };

        this.filters = values;
        this.currentPage = 1;

        this.props.fetchServers(this.currentPage, this.filters);
        this.props.fetchStatistics();
    }

    render() {
        let servers = this.props.state.servers.data || [];
        let countries = this.props.state.statistics.server_countries || [];

        let playButtonClassNames;
        if (this.autoRefresh) {
            playButtonClassNames = "btn btn-danger btn-xs";
        } else {
            playButtonClassNames = "btn btn-success btn-xs";
        }

        let filterButtonClassNames = "btn btn-primary btn-xs";
        if (this.filtersOpened) {
            filterButtonClassNames += " active";
        }

        return (
            <div className="row">
                <div className="col-md-12 col-xs-12 col-sm-12 col-lg-12">
                    <div className="panel panel-primary panel-table">
                        <div className="panel-heading">
                            <h3 className="panel-title">Servers</h3>
                            <div className="panel-tools">
                                <a
                                    href="#"
                                    className={playButtonClassNames}
                                    onClick={this.handleButtonAutoRefreshClick.bind(this)}
                                >
                                    <span className="glyphicon glyphicon-refresh"/>
                                    Auto Refresh
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
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Availability</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterAvailability = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                        defaultValue="online"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="online">Online</option>
                                                        <option value="offline">Offline</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
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
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Ping</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterPing = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="fastest">Fastest (0 - 3 seconds)</option>
                                                        <option value="fast">Fast (3 - 10 seconds)</option>
                                                        <option value="medium">Medium (10 - 25 seconds)</option>
                                                        <option value="slow">Slow (25+ seconds)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Speed</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterSpeed = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="fastest">Fastest (25+ kB/seconds)</option>
                                                        <option value="fast">Fast (10 - 25 kB/seconds)</option>
                                                        <option value="medium">Medium (2 - 10 kB/seconds)</option>
                                                        <option value="slow">Slow ( > 2 kB/seconds)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Uptime Ratio</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterUptimeRatio = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="greatest"> >75%</option>
                                                        <option value="great"> 50 - 75%</option>
                                                        <option value="medium"> 25 - 50%</option>
                                                        <option value="low"> 0 - 25%</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Country</label>
                                                    <select
                                                        ref={(input) => {
                                                            this.filterCountry = input;
                                                        }}
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="form-control input-sm"
                                                    >
                                                        <option value="all">All</option>
                                                        {
                                                            countries.map((obj, i) => {
                                                                return <option key={i} value={obj.country}>{obj.country}
                                                                    ({obj.count})</option>;
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="filters-buttons">
                                                    <button
                                                        className="btn btn-primary btn-xs"
                                                        type="reset"
                                                        onClick={(e) => {
                                                            this.filters = {};
                                                            this.props.fetchServers(this.currentPage, this.filters);
                                                            this.props.fetchStatistics();
                                                        }}
                                                    >
                                                        Reset
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <table className="proxy-table table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th style={{width: "160px"}}>Address</th>
                                    <th style={{width: "120px"}}>Type</th>
                                    <th style={{width: "60px"}}>Status</th>
                                    <th style={{width: "65px"}}>Ping</th>
                                    <th style={{width: "65px"}}>Uptime Ratio</th>
                                    <th style={{width: "100px"}}>Speed</th>
                                    <th style={{width: "100px"}} className="hidden-sm hidden-xs">Country</th>
                                    <th style={{width: "100px"}} className="hidden-sm hidden-xs">City</th>
                                    <th style={{width: "100px"}} className="hidden-sm hidden-xs">Checked at</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    servers.map((obj) => {
                                        return <TableRowComponent {...this.props} key={obj.address_img_url}
                                                                  rowData={obj}/>
                                    })
                                }
                                </tbody>
                            </table>
                            <TablePaginationComponent {...this.props}
                                                      handlePrevPageClick={this.handlePrevPageClick.bind(this)}
                                                      handleNextPageClick={this.handleNextPageClick.bind(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TableComponent;