import React from 'react';
import {formatBytes} from '../helpers/number-helper';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

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
                speedClassName = 'label label-danger';
            } else if (speed >= 2048 && speed < 10240) {
                speedClassName = 'label label-warning';
            } else if (speed >= 10240 && speed <= 25600) {
                speedClassName = 'label label-info';
            } else {
                speedClassName = 'label label-success';
            }
            speed = `${formatBytes(speed, true)}/s`;
        } else {
            speed = 'ERROR';
            speedClassName = 'label label-danger';
        }


        let pingClassName;
        if (obj.ping < 3) {
            pingClassName = 'label label-success';
        } else if (obj.ping >= 3 && obj.ping < 10) {
            pingClassName = 'label label-info';
        } else if (obj.ping >= 10 && obj.ping < 25) {
            pingClassName = 'label label-warning'
        } else {
            pingClassName = 'label label-danger';
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
                <td>
                    <img src={obj.address_img_url}/>
                </td>
                <td>{type}</td>
                <td className="text-center"><span className={pingClassName}>{obj.ping}s</span></td>
                <td className="text-center"><span className={pingRatioClassName}>{obj.ping_success} / {obj.ping_error}</span></td>
                <td className="text-center">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="speed-checked-at">checked {obj.speed_checked_at}</Tooltip>}>
                        <span className={speedClassName}>{speed} <i className="glyphicon-info-sign glyphicon"/></span>
                    </OverlayTrigger>
                </td>
                <td style={{maxWidth: '120px'}} className="hidden-sm hidden-xs">
                    {obj.country}
                </td>
                <td style={{maxWidth: '120px'}} className="hidden-sm hidden-xs">{obj.city}</td>
                <td style={{maxWidth: '120px'}} className="hidden-sm hidden-xs">{obj.checked_at}</td>
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
        const ping = this.filterPing.value;
        const speed = this.filterSpeed.value;

        const values = {
            availability,
            type,
            ping,
            speed
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
        if (this.filtersOpened) {
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
                                            <div className="col-md-4">

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
                                            <div className="col-md-4">

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="filters-buttons">
                                                    <button
                                                        className="btn btn-default btn-xs"
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
                                    <th style={{width: "80px"}}>Ping</th>
                                    <th style={{width: "90px"}}>Ping Ratio</th>
                                    <th style={{width: "100px"}}>Speed</th>
                                    <th style={{width: "110px"}} className="hidden-sm hidden-xs">Country</th>
                                    <th style={{width: "110px"}} className="hidden-sm hidden-xs">City</th>
                                    <th style={{width: "110px"}} className="hidden-sm hidden-xs">Checked at</th>
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