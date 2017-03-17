import React from 'react';
import {
    Form,
    FormGroup,
    Col,
    Button,
    ControlLabel,
    FormControl,
    Tooltip,
    OverlayTrigger
} from 'react-bootstrap';
import {getFormData} from '../../helpers/form-helper';
import ReactDOM from 'react-dom';
import Permission from '../Permission';

class FiltersComponent extends React.Component {

    constructor() {
        super();
    }

    handleOnChangeFiltersInput(e) {
        let form = ReactDOM.findDOMNode(this.form);
        let values = getFormData(form);
        this.props.setFilters(values);
    }

    render() {
        let countries = this.props.state.statistics.server_countries || [];
        let filtersEnabled = this.props.state.session.user.permissions['server.filter_all'];

        return (
            <div className="col-md-12">
                <div className="panel panel-default panel-statistics">
                    <div className="panel-heading">
                        <h3 className="panel-title"><i className="fa fa-filter"/> Filters</h3>
                    </div>
                    <Form horizontal ref={(form) => {
                        this.form = form;
                    }}>
                        <div>
                            <div className="panel-body">
                                <div className="filters">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                                <Col componentClass={ControlLabel} sm={3} md={4}>
                                                    Status
                                                </Col>
                                                <Col sm={9} md={8}>
                                                    <FormControl
                                                        name="status"
                                                        componentClass="select"
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="input-sm"
                                                    >
                                                        <option value="online">Online</option>
                                                        <option value="offline">Offline</option>
                                                        <option value="all">All</option>
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                                <Col componentClass={ControlLabel} sm={3} md={4}>
                                                    Type
                                                    <Permission {...this.props} permission="server.filter_all"
                                                                value={false}>
                                                        <OverlayTrigger placement="top"
                                                                        overlay={<Tooltip id="premium-enable">Option
                                                                            SOCKS5 available
                                                                            only for premium users.</Tooltip>}>
                                                            <i className="fa fa-question-circle text-info"/>
                                                        </OverlayTrigger>
                                                    </Permission>
                                                </Col>
                                                <Col sm={9} md={8}>
                                                    <FormControl
                                                        name="type"
                                                        componentClass="select"
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="input-sm"
                                                        defaultValue="all"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="http_elite">HTTP elite</option>
                                                        <option value="http_anonymous">HTTP anonymous</option>
                                                        <option value="http_transparent">HTTP transparent</option>
                                                        <option value="socks5_elite" disabled={!filtersEnabled}>SOCKS5
                                                            elite
                                                        </option>
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                                <Col componentClass={ControlLabel} sm={3} md={4}>
                                                    Ping
                                                    <Permission {...this.props} permission="server.filter_all"
                                                                value={false}>
                                                        <OverlayTrigger placement="top"
                                                                        overlay={<Tooltip id="premium-enable">Option
                                                                            available
                                                                            only for premium users.</Tooltip>}>
                                                            <i className="fa fa-question-circle text-info"/>
                                                        </OverlayTrigger>
                                                    </Permission>
                                                </Col>
                                                <Col sm={9} md={8}>
                                                    <FormControl
                                                        name="ping"
                                                        componentClass="select"
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="input-sm"
                                                        defaultValue="all"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="fastest" disabled={!filtersEnabled}>Fastest (0 -
                                                            3
                                                            seconds)
                                                        </option>
                                                        <option value="fast" disabled={!filtersEnabled}>Fast (3 - 10
                                                            seconds)
                                                        </option>
                                                        <option value="medium" disabled={!filtersEnabled}>Medium (10 -
                                                            25
                                                            seconds)
                                                        </option>
                                                        <option value="slow" disabled={!filtersEnabled}>Slow (25+
                                                            seconds)
                                                        </option>
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                                <Col componentClass={ControlLabel} sm={3} md={4}>
                                                    Speed
                                                    <Permission {...this.props} permission="server.filter_all"
                                                                value={false}>
                                                        <OverlayTrigger placement="top"
                                                                        overlay={<Tooltip id="premium-enable">Option
                                                                            available
                                                                            only for premium users.</Tooltip>}>
                                                            <i className="fa fa-question-circle text-info"/>
                                                        </OverlayTrigger>
                                                    </Permission>
                                                </Col>
                                                <Col sm={9} md={8}>
                                                    <FormControl
                                                        name="speed"
                                                        componentClass="select"
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="input-sm"
                                                        defaultValue="all"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="fastest" disabled={!filtersEnabled}>Fastest (25+
                                                            kB/seconds)
                                                        </option>
                                                        <option value="fast" disabled={!filtersEnabled}>Fast (10 - 25
                                                            kB/seconds)
                                                        </option>
                                                        <option value="medium" disabled={!filtersEnabled}>Medium (2 - 10
                                                            kB/seconds)
                                                        </option>
                                                        <option value="slow" disabled={!filtersEnabled}>Slow ( > 2
                                                            kB/seconds)
                                                        </option>
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                                <Col componentClass={ControlLabel} sm={3} md={4}>
                                                    Uptime ratio
                                                    <Permission {...this.props} permission="server.filter_all"
                                                                value={false}>
                                                        <OverlayTrigger placement="top"
                                                                        overlay={<Tooltip id="premium-enable">Option
                                                                            available
                                                                            only for premium users.</Tooltip>}>
                                                            <i className="fa fa-question-circle text-info"/>
                                                        </OverlayTrigger>
                                                    </Permission>
                                                </Col>
                                                <Col sm={9} md={8}>
                                                    <FormControl
                                                        name="uptime_ratio"
                                                        componentClass="select"
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="input-sm"
                                                        defaultValue="all"
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="greatest" disabled={!filtersEnabled}> >75%
                                                        </option>
                                                        <option value="great" disabled={!filtersEnabled}> 50 - 75%
                                                        </option>
                                                        <option value="medium" disabled={!filtersEnabled}> 25 - 50%
                                                        </option>
                                                        <option value="low" disabled={!filtersEnabled}> 0 - 25%</option>
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                                <Col componentClass={ControlLabel} sm={3} md={4}>
                                                    Country
                                                    <Permission {...this.props} permission="server.filter_all"
                                                                value={false}>
                                                        <OverlayTrigger placement="top"
                                                                        overlay={<Tooltip id="premium-enable">Option
                                                                            available
                                                                            only for premium users.</Tooltip>}>
                                                            <i className="fa fa-question-circle text-info"/>
                                                        </OverlayTrigger>
                                                    </Permission>
                                                </Col>
                                                <Col sm={9} md={8}>
                                                    <FormControl
                                                        name="country"
                                                        componentClass="select"
                                                        onChange={this.handleOnChangeFiltersInput.bind(this)}
                                                        className="input-sm"
                                                        defaultValue="all"
                                                    >
                                                        <option value="all">All</option>
                                                        {
                                                            countries.map((obj, i) => {
                                                                return <option key={i} value={obj.country}
                                                                               disabled={!filtersEnabled}>{obj.country}
                                                                    &nbsp;({obj.count})</option>;
                                                            })
                                                        }
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="panel-footer">
                                <FormGroup className="form-group-sm text-right">
                                    <Col>
                                        <Button type="reset" className="btn-xs btn" onClick={(e) => {
                                            this.props.setFilters({});
                                        }}>
                                            Reset
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default FiltersComponent;