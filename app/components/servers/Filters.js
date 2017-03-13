import React from 'react';
import {
    Form,
    FormGroup,
    Col,
    Button,
    ControlLabel,
    FormControl,
} from 'react-bootstrap';
import {getFormData} from '../../helpers/form-helper';
import ReactDOM from 'react-dom';

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

        return (
            <div className="flex-child">
                <div className="panel panel-primary panel-statistics">
                    <div className="panel-heading">
                        <h3 className="panel-title"><i className="fa fa-filter"/> Filters</h3>
                    </div>
                    <div className="panel-body">
                        <div className="filters">
                            <Form horizontal ref={(form) => {
                                this.form = form;
                            }}>
                                <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Status
                                    </Col>
                                    <Col sm={9}>
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

                                <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Type
                                    </Col>
                                    <Col sm={9}>
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
                                            <option value="socks5_elite">SOCKS5 elite</option>
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Ping
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl
                                            name="ping"
                                            componentClass="select"
                                            onChange={this.handleOnChangeFiltersInput.bind(this)}
                                            className="input-sm"
                                            defaultValue="all"
                                        >
                                            <option value="all">All</option>
                                            <option value="fastest">Fastest (0 - 3 seconds)</option>
                                            <option value="fast">Fast (3 - 10 seconds)</option>
                                            <option value="medium">Medium (10 - 25 seconds)</option>
                                            <option value="slow">Slow (25+ seconds)</option>
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Speed
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl
                                            name="speed"
                                            componentClass="select"
                                            onChange={this.handleOnChangeFiltersInput.bind(this)}
                                            className="input-sm"
                                            defaultValue="all"
                                        >
                                            <option value="all">All</option>
                                            <option value="fastest">Fastest (25+ kB/seconds)</option>
                                            <option value="fast">Fast (10 - 25 kB/seconds)</option>
                                            <option value="medium">Medium (2 - 10 kB/seconds)</option>
                                            <option value="slow">Slow ( > 2 kB/seconds)</option>
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Uptime ratio
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl
                                            name="uptime_ratio"
                                            componentClass="select"
                                            onChange={this.handleOnChangeFiltersInput.bind(this)}
                                            className="input-sm"
                                            defaultValue="all"
                                        >
                                            <option value="all">All</option>
                                            <option value="greatest"> >75%</option>
                                            <option value="great"> 50 - 75%</option>
                                            <option value="medium"> 25 - 50%</option>
                                            <option value="low"> 0 - 25%</option>
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalEmail" className="form-group-sm">
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Country
                                    </Col>
                                    <Col sm={9}>
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
                                                    return <option key={i} value={obj.country}>{obj.country}
                                                        ({obj.count})</option>;
                                                })
                                            }
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup className="form-group-sm">
                                    <Col smOffset={3} sm={9}>
                                        <Button type="reset" className="btn-xs btn" onClick={(e) => {
                                            this.props.setFilters({});
                                        }}>
                                            Reset
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FiltersComponent;