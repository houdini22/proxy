import React from 'react';
import {
    FormControl,
    Radio,
    Checkbox
} from 'react-bootstrap';
import {getFormData} from '../../helpers/form-helper';

class FiltersComponent extends React.Component {
    constructor() {
        super();
        this.filters = {};
    }

    handleOnClickBtn(name) {
        Object.keys(this.refs).filter((key) => {
            return key.indexOf('filter.detail.') === 0 && key.indexOf(name) === -1;
        }).forEach((key => {
            let detail = this.refs[key];
            if (detail.getAttribute('data-is-active') === 'true') {
                detail.style.display = 'none';
                detail.setAttribute('data-is-active', 'false');
            }
        }));

        Object.keys(this.refs).filter((key) => {
            return key.indexOf('filter.btn.') === 0 && key.indexOf(name) === -1;
        }).forEach((key => {
            let btn = this.refs[key];
            btn.classList.remove('active');
        }));

        let btn = this.refs['filter.btn.' + name];
        let detail = this.refs['filter.detail.' + name];
        let active = detail.getAttribute('data-is-active') === 'true' || false;
        if (!active) {
            detail.style.display = 'block';
            detail.setAttribute('data-is-active', 'true');
            btn.classList.add('active');
        } else {
            detail.style.display = 'none';
            detail.setAttribute('data-is-active', 'false');
            btn.classList.remove('active');
        }
    }

    handleFilterChange(e, groupName) {
        let el = e.target;
        let realName = el.name;
        let isArray = realName.slice(-2) === '[]';
        let name = isArray ? realName.substr(0, realName.length - 2) : realName;
        let checked = (el.type === 'radio' || el.type === 'checkbox') ? el.checked : el.value;
        let value = el.value;

        if (isArray) {
            if (!this.filters[name]) {
                this.filters[name] = new Array();
            }
            if (checked) {
                this.filters[name].push(value)
            } else {
                this.filters[name].splice(this.filters[name].indexOf(value), 1);
                if (this.filters[name].length === 0) {
                    delete this.filters[name];
                }
            }
        } else {
            if (checked) {
                this.filters[name] = value;
            } else {
                delete this.filters[name];
            }
        }

        let btn = this.refs[`filter.btn.${name}`];
        let marked = !!this.filters[name];
        if (marked) {
            btn.classList.add('is-active');
        } else {
            btn.classList.remove('is-active');
        }

        this.props.setFilters(this.filters);
    }

    render() {
        let countries = this.props.state.statistics.server_countries || [];

        return (
            <div>
                <div className="panel-filters">
                    <a className="btn btn-app btn-xs" data-name="type" ref="filter.btn.type"
                       onClick={this.handleOnClickBtn.bind(this, 'type')}>
                        <span>Type</span>
                        <i className="fa fa-chevron-right"/>
                    </a>
                    <a className="btn btn-app btn-xs is-active" data-name="status" ref="filter.btn.status"
                       onClick={this.handleOnClickBtn.bind(this, 'status')}>
                        <span>Status</span>
                        <i className="fa fa-chevron-right"/>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="latency" ref="filter.btn.latency"
                       onClick={this.handleOnClickBtn.bind(this, 'latency')}>
                        <span>Latency</span>
                        <i className="fa fa-chevron-right"/>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="uptime" ref="filter.btn.uptime"
                       onClick={this.handleOnClickBtn.bind(this, 'uptime')}>
                        <span>Uptime</span>
                        <i className="fa fa-chevron-right"/>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="speed" ref="filter.btn.speed"
                       onClick={this.handleOnClickBtn.bind(this, 'speed')}>
                        <span>Speed</span>
                        <i className="fa fa-chevron-right"/>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="country" ref="filter.btn.country"
                       onClick={this.handleOnClickBtn.bind(this, 'country')}>
                        <span>Country</span>
                        <i className="fa fa-chevron-right"/>
                    </a>
                </div>
                <div className="panel-filters-details" ref="filters_container">
                    <div data-name="type" ref="filter.detail.type">
                        <ul className="list-group">
                            <li className="list-group-item">
                                <Checkbox name="type[]" value="http_elite" ref="filter.filter.type.http_elite"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'type');
                                          }}>
                                    <span>
                                        HTTP&nbsp;
                                        <small>elite</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item">
                                <Checkbox name="type[]" value="http_transparent"
                                          ref="filter.filter.type.http_transparent"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'type');
                                          }}>
                                    <span>
                                        HTTP&nbsp;
                                        <small>transparent</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item">
                                <Checkbox name="type[]" value="socks5_elite" ref="filter.filter.type.socks5_elite"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'type');
                                          }}>
                                    <span>
                                        SOCKS5&nbsp;
                                        <small>elite</small>
                                    </span>
                                </Checkbox>
                            </li>
                        </ul>
                    </div>
                    <div data-name="status" ref="filter.detail.status">
                        <ul className="list-group">
                            <li className="list-group-item bg-success-light">
                                <Radio name="status" value="online" defaultChecked="checked"
                                       ref="filter.filter.status.online"
                                       onChange={(e) => {
                                           this.handleFilterChange(e, 'status');
                                       }}>
                                    <span>
                                        online
                                    </span>
                                </Radio>
                            </li>
                            <li className="list-group-item bg-danger-light">
                                <Radio name="status" value="offline" ref="filter.filter.status.offline"
                                       onChange={(e) => {
                                           this.handleFilterChange(e, 'status');
                                       }}>
                                    offline
                                </Radio>
                            </li>
                        </ul>
                    </div>
                    <div data-name="latency" ref="filter.detail.latency">
                        <ul className="list-group">
                            <li className="list-group-item bg-success-light">
                                <Checkbox name="latency[]" value="fastest" ref="filter.filter.latency.fastest"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'latency');
                                          }}>
                                    <span>
                                        Fastest&nbsp;
                                        <small>(0 - 3 seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-info-light">
                                <Checkbox name="latency[]" value="fast" ref="filter.filter.latency.fast"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'latency');
                                          }}>
                                    <span>
                                        Fast&nbsp;
                                        <small>(3 - 10 seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-warning-light">
                                <Checkbox name="latency[]" value="medium" ref="filter.filter.latency.medium"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'latency');
                                          }}>
                                    <span>
                                        Medium&nbsp;
                                        <small>(10 - 25 seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-danger-light">
                                <Checkbox name="latency[]" value="slow" ref="filter.filter.latency.slow"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'latency');
                                          }}>
                                    <span>
                                        Slow&nbsp;
                                        <small>(25+ seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                        </ul>
                    </div>
                    <div data-name="speed" ref="filter.detail.speed">
                        <ul className="list-group">
                            <li className="list-group-item bg-success-light">
                                <Checkbox name="speed[]" value="fastest" ref="filter.filter.speed.fastest"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'speed');
                                          }}>
                                    <span>
                                        Fastest&nbsp;
                                        <small>(25+ kB/seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-info-light">
                                <Checkbox name="speed[]" value="fast" ref="filter.filter.speed.fast"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'speed');
                                          }}>
                                    <span>
                                        Fast&nbsp;
                                        <small>(10 - 25 kB/seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-warning-light">
                                <Checkbox name="speed[]" value="medium" ref="filter.filter.speed.medium"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'speed');
                                          }}>
                                    <span>
                                        Medium&nbsp;
                                        <small>(2 - 10 kB/seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-danger-light">
                                <Checkbox name="speed[]" value="slow" ref="filter.filter.speed.slow"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'speed');
                                          }}>
                                    <span>
                                        Slow&nbsp;
                                        <small>( > 2 kB/seconds)</small>
                                    </span>
                                </Checkbox>
                            </li>
                        </ul>
                    </div>
                    <div data-name="uptime" ref="filter.detail.uptime">
                        <ul className="list-group">
                            <li className="list-group-item bg-success-light">
                                <Checkbox name="uptime[]" value="greatest" ref="filter.filter.uptime.greatest"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        >75%
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-info-light">
                                <Checkbox name="uptime[]" value="great" ref="filter.filter.uptime.great"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        50 - 75%
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-warning-light">
                                <Checkbox name="uptime[]" value="medium" ref="filter.filter.uptime.medium"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        25 - 50%
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-danger-light">
                                <Checkbox name="uptime[]" value="low" ref="filter.filter.uptime.low"
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        0 - 25%
                                    </span>
                                </Checkbox>
                            </li>
                        </ul>
                    </div>
                    <div data-name="country" ref="filter.detail.country">
                        <div>
                            <FormControl
                                name="country"
                                componentClass="select"
                                className="input-sm"
                                defaultValue="all"
                                ref="filter.filter.country"
                                onChange={(e) => {
                                    this.handleFilterChange(e, 'country');
                                }}
                            >
                                <option value="">all countries</option>
                                {
                                    countries.map((obj, i) => {
                                        return <option key={i} value={obj.country}>{obj.country}
                                            &nbsp;({obj.count})</option>;
                                    })
                                }
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FiltersComponent;