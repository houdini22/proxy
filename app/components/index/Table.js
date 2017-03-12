import React from 'react';
import {formatBytes} from '../../helpers/number-helper';
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
            if (obj.speed_checked_at === null) {
                speed = "not checked"
            } else {
                speed = 'error';
            }
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

        let pingRatio = (obj.ping_success + obj.speed_success) / (obj.speed_error + obj.ping_error);
        if (obj.is_socks) {
            pingRatio = (obj.ping_socks_success + obj.speed_success) / (obj.ping_socks_error + obj.speed_error);
        }

        let uploadRatioClassName;
        if (pingRatio > 0.75) {
            uploadRatioClassName = 'label label-success';
        } else if (pingRatio <= 0.75 && pingRatio > 0.50) {
            uploadRatioClassName = 'label label-info';
        } else if (pingRatio <= 0.50 && pingRatio > 0.25) {
            uploadRatioClassName = 'label label-warning';
        } else {
            uploadRatioClassName = 'label label-danger';
        }

        let type;
        if (obj.is_socks) {
            type = 'SOCKS5 ';
        } else {
            type = 'HTTP ';
        }
        type += obj.type;

        let checked = `checked ${obj.speed_checked_at}`;
        if (obj.speed_checked_at === null) {
            checked = 'not checked yet';
        }

        let tooltip;
        if (obj.speed === null) {
            let tooltipText = '';
            if (obj.last_speed_error_status_code !== null) {
                tooltipText = `Status code: [${obj.last_speed_error_status_code}] `;
            }
            if (obj.last_speed_error_message !== null) {
                tooltipText += `Message: ${obj.last_speed_error_message}`;
            }
            if (tooltipText.length === 0) {
                tooltipText = 'No error message specified.';
            }
            tooltip = <Tooltip id="speed-tooltip">{tooltipText}</Tooltip>;
        } else {
            tooltip = <Tooltip id="speed-tooltip">{checked}</Tooltip>;
        }

        let uptimeRatioText = `${obj.ping_success + obj.speed_success} / ${obj.ping_error + obj.speed_error}`;
        if(obj.is_socks) {
            uptimeRatioText = `${obj.ping_socks_success + obj.speed_success} / ${obj.ping_socks_error + obj.speed_error}`;
        }

        let checked_at = obj.checked_at;
        if(obj.is_socks) {
            checked_at = obj.socks_checked_at;
        }

        let onlineText = obj.is_available ? 'online' : 'offline';
        let onlineTextClassName = obj.is_available ? 'label label-success' : 'label label-danger';

        return (
            <tr key={obj.address_img_url}>
                <td style={{textAlign: 'center'}}>
                    <img src={obj.address_img_url}/>
                </td>
                <td>{type}</td>
                <td><span className={onlineTextClassName}>{onlineText}</span></td>
                <td className="text-center"><span className={pingClassName}>{obj.ping}s</span></td>
                <td className="text-center">
                    <span
                        className={uploadRatioClassName}>
                        {uptimeRatioText}
                    </span>
                </td>
                <td className="text-center">
                    <OverlayTrigger placement="top" overlay={tooltip}>
                        <span className={speedClassName}>{speed} <i className="glyphicon-info-sign glyphicon"/></span>
                    </OverlayTrigger>
                </td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">
                    {obj.country}
                </td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">{obj.city}</td>
                <td style={{maxWidth: '110px'}} className="hidden-sm hidden-xs">{checked_at}</td>
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
        let currentPage = this.props.state.servers.current_page || 0;
        let lastPage = this.props.state.servers.last_page || 0;
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
                                    <th style={{width: "60px"}}>Online</th>
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