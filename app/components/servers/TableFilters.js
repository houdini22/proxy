import React from 'react';
import {
    FormControl,
    Radio,
    Checkbox
} from 'react-bootstrap';

class TableFiltersComponent extends React.Component {
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
            this.refs.filters_overlay.style.display = 'block';
        } else {
            detail.style.display = 'none';
            detail.setAttribute('data-is-active', 'false');
            btn.classList.remove('active');
            this.refs.filters_overlay.style.display = 'none';
        }
    }

    handleFilterChange(e, groupName) {
        let el = e.currentTarget;
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


        let label = this.refs[`filter.btn.label.${name}`];
        let reset = this.refs[`filter.btn.reset.${name}`];
        let text = 0;
        if (this.filters[name]) {
            text = 1;
            if (Array.isArray(this.filters[name])) {
                text = this.filters[name].length;
            }
        }
        label.textContent = text;
        if (text) {
            label.style.display = 'inline';
            if (reset) {
                reset.style.display = 'inline';
            }
        } else {
            label.style.display = 'none';
            if (reset) {
                reset.style.display = 'none';
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

    handleOnClickReset(e, name) {
        e.preventDefault();
        e.stopPropagation();

        let label = this.refs[`filter.btn.label.${name}`];
        let reset = this.refs[`filter.btn.reset.${name}`];
        let btn = this.refs[`filter.btn.${name}`];
        let detail = this.refs['filter.detail.' + name];

        label.style.display = 'none';
        reset.style.display = 'none';
        btn.classList.remove('is-active');
        detail.removeAttribute('data-is-active', 'false');
        detail.style.display = 'none';
        btn.classList.remove('active');
        this.refs.filters_overlay.style.display = 'none';

        delete this.filters[name];

        Object.keys(this.refs).filter((key) => {
            return key.indexOf(`filter.filter.${name}`) === 0;
        }).forEach((key => {
            let filter = this.refs[key];
            if (filter.type === 'radio' || filter.type === 'checkbox') {
                if (filter.checked) {
                    filter.checked = false;
                }
            } else {
                filter.value = '';
            }
        }));

        this.props.setFilters(this.filters);
    }

    render() {
        let countries = this.props.state.statistics.server_countries || [];
        let filtersEnabled = this.props.state.session.user.permissions['server.filter_all'];

        return (
            <div>
                <div className="panel-filters">
                    <a className="btn btn-app btn-xs is-active" data-name="status" ref="filter.btn.status"
                       onClick={this.handleOnClickBtn.bind(this, 'status')}>
                        <span className="caption">Status</span>
                        <i className="fa fa-chevron-right"/>
                        <span className="label-container">
                            <span className="label bg-yellow" ref="filter.btn.label.status">1</span>
                        </span>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="type" ref="filter.btn.type"
                       onClick={this.handleOnClickBtn.bind(this, 'type')}>
                        <span className="caption">Type</span>
                        <i className="fa fa-chevron-right"/>
                        <span className="label-container">
                            <span className="label bg-yellow" ref="filter.btn.label.type"
                                  style={{display: 'none'}}>0</span>
                            <span className="reset" ref="filter.btn.reset.type"
                                  onClick={(e) => {
                                      this.handleOnClickReset(e, 'type')
                                  }}>reset</span>
                        </span>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="latency" ref="filter.btn.latency"
                       onClick={this.handleOnClickBtn.bind(this, 'latency')}>
                        <span className="caption">Latency</span>
                        <i className="fa fa-chevron-right"/>
                        <span className="label-container">
                            <span className="label bg-yellow" ref="filter.btn.label.latency"
                                  style={{display: 'none'}}>0</span>
                            <span className="reset" ref="filter.btn.reset.latency" onClick={(e) => {
                                this.handleOnClickReset(e, 'latency')
                            }}>reset</span>
                        </span>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="uptime" ref="filter.btn.uptime"
                       onClick={this.handleOnClickBtn.bind(this, 'uptime')}>
                        <span className="caption">Uptime</span>
                        <i className="fa fa-chevron-right"/>
                        <span className="label-container">
                            <span className="label bg-yellow" ref="filter.btn.label.uptime"
                                  style={{display: 'none'}}>0</span>
                            <span className="reset" ref="filter.btn.reset.uptime" onClick={(e) => {
                                this.handleOnClickReset(e, 'uptime')
                            }}>reset</span>
                        </span>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="speed" ref="filter.btn.speed"
                       onClick={this.handleOnClickBtn.bind(this, 'speed')}>
                        <span className="caption">Speed</span>
                        <i className="fa fa-chevron-right"/>
                        <span className="label-container">
                            <span className="label bg-yellow" ref="filter.btn.label.speed"
                                  style={{display: 'none'}}>0</span>
                            <span className="reset" ref="filter.btn.reset.speed" onClick={(e) => {
                                this.handleOnClickReset(e, 'speed')
                            }}>reset</span>
                        </span>
                    </a>
                    <a className="btn btn-app btn-xs" data-name="country" ref="filter.btn.country"
                       onClick={this.handleOnClickBtn.bind(this, 'country')}>
                        <span className="caption">Country</span>
                        <i className="fa fa-chevron-right"/>
                        <span className="label-container">
                            <span className="label bg-yellow" ref="filter.btn.label.country"
                                  style={{display: 'none'}}>0</span>
                            <span className="reset" ref="filter.btn.reset.country" onClick={(e) => {
                                this.handleOnClickReset(e, 'country')
                            }}>reset</span>
                        </span>
                    </a>
                </div>
                <div className="panel-filters-details" ref="filters_container">
                    <div data-name="type" ref="filter.detail.type">
                        <ul className="list-group">
                            <li className="list-group-item">
                                <Checkbox name="type[]" value="http_elite" inputRef={(input) => {
                                    this.refs['filter.filter.type.http_elite'] = input;
                                }}
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
                                          inputRef={(input) => {
                                              this.refs['filter.filter.type.http_transparent'] = input;
                                          }}
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
                                <Checkbox name="type[]" value="socks5_elite"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.type.socks5_elite'] = input;
                                          }}
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
                                       inputRef={(input) => {
                                           this.refs['filter.filter.status.online'] = input;
                                       }}
                                       onChange={(e) => {
                                           this.handleFilterChange(e, 'status');
                                       }}>
                                    <span>
                                        online
                                    </span>
                                </Radio>
                            </li>
                            <li className="list-group-item bg-danger-light">
                                <Radio name="status" value="offline"
                                       inputRef={(input) => {
                                           this.refs['filter.filter.status.offline'] = input;
                                       }}
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
                                <Checkbox name="latency[]" value="fastest"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.latency.fastest'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="latency[]" value="fast"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.latency.fast'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="latency[]" value="medium"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.latency.medium'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="latency[]" value="slow"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.latency.slow'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="speed[]" value="fastest"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.speed.fastest'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="speed[]" value="fast"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.speed.fast'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="speed[]" value="medium"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.speed.medium'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="speed[]" value="slow"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.speed.slow'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                <Checkbox name="uptime[]" value="greatest"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.uptime.greatest'] = input;
                                          }}
                                          disabled={!filtersEnabled}
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        >75%
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-info-light">
                                <Checkbox name="uptime[]" value="great"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.uptime.great'] = input;
                                          }}
                                          disabled={!filtersEnabled}
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        50 - 75%
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-warning-light">
                                <Checkbox name="uptime[]" value="medium"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.uptime.medium'] = input;
                                          }}
                                          disabled={!filtersEnabled}
                                          onChange={(e) => {
                                              this.handleFilterChange(e, 'uptime');
                                          }}>
                                    <span>
                                        25 - 50%
                                    </span>
                                </Checkbox>
                            </li>
                            <li className="list-group-item bg-danger-light">
                                <Checkbox name="uptime[]" value="low"
                                          inputRef={(input) => {
                                              this.refs['filter.filter.uptime.low'] = input;
                                          }}
                                          disabled={!filtersEnabled}
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
                                disabled={!filtersEnabled}
                                inputRef={(input) => {
                                    this.refs['filter.filter.country'] = input;
                                }}
                                onChange={(e) => {
                                    this.handleFilterChange(e, 'country');
                                }}
                            >
                                <option value="">all countries</option>
                                {
                                    countries.map((obj, i) => {
                                        return (<option key={i} value={obj.country}>{obj.country}
                                            &nbsp;({obj.count})</option>);
                                    })
                                }
                            </FormControl>

                        </div>
                    </div>
                    <div className="panel-filters-details-overlay" ref="filters_overlay"></div>
                </div>
            </div>
        );
    }
}

export default TableFiltersComponent;