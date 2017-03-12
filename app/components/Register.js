import React from 'react';
import MainHeaderComponent from './header/Main';
import TableComponent from './index/Table';
import StatisticsComponent from './index/Statistics';
import PromoBoxComponent from './index/PromoBox';
import {Form, FormGroup, Col, Button, ControlLabel, Checkbox, FormControl, HelpBlock} from 'react-bootstrap';
import {getFormData} from '../helpers/form-helper';

class IndexComponent extends React.Component {
    constructor() {
        super();
        this.getValidationState = this.getValidationState.bind(this);
        this.state = {
            errors: {}
        };
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({errors: {}});
        const data = getFormData(e);
        this.props.ajax.post('/register', data)
            .then((response) => {

            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data
                });
            });
    }

    getNewCaptcha() {
        this.captchaImage.setAttribute("src", "");
        this.captchaImage.setAttribute("src", this.props.router.createHref('/captcha/' + (new Date()).getTime()));
    }

    getValidationState(field) {
        if (!this.state.errors[field]) {
            return null;
        }
        return 'error';
    }

    getValidationError(field) {
        if (!this.state.errors[field]) {
            return null;
        }
        return <HelpBlock>{this.state.errors[field].join(' ')}</HelpBlock>
    }

    render() {
        return (
            <div className="page page-register">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <div className="page page-register">
                        <div className="well">
                            <h1 className="page-header">Register</h1>
                            <Form horizontal onSubmit={this.onSubmit.bind(this)}>
                                <FormGroup controlId="formHorizontalEmail"
                                           validationState={this.getValidationState('email')}>
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Email
                                    </Col>
                                    <Col sm={10}>
                                        <FormControl
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                        />
                                        {this.getValidationError('email')}
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalEmailRepeat"
                                           validationState={this.getValidationState('email_repeat')}>
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Repeat email
                                    </Col>
                                    <Col sm={10}>
                                        <FormControl
                                            type="email"
                                            placeholder="Repeat email"
                                            name="email_repeat"
                                        />
                                        {this.getValidationError('email_repeat')}
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalPassword"
                                           validationState={this.getValidationState('password')}>
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Password
                                    </Col>
                                    <Col sm={10}>
                                        <FormControl
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                        />
                                        {this.getValidationError('password')}
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="formHorizontalPasswordRepeat"
                                           validationState={this.getValidationState('password_repeat')}>
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Repeat password
                                    </Col>
                                    <Col sm={10}>
                                        <FormControl
                                            type="password"
                                            placeholder="Repeat password"
                                            name="password_repeat"
                                        />
                                        {this.getValidationError('password_repeat')}
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col smOffset={2} sm={10}>
                                        <Checkbox
                                            defaultChecked={true}
                                            name="newsletter"
                                            value="1"
                                        >
                                            I agree to receive a
                                            newsletter.
                                        </Checkbox>
                                    </Col>
                                </FormGroup>

                                <FormGroup validationState={this.getValidationState('captcha')}>
                                    <Col sm={2} componentClass={ControlLabel}>
                                        I'm not a robot
                                    </Col>
                                    <Col sm={10}>
                                        <p>
                                            <img
                                                className="captcha"
                                                src={this.props.router.createHref('/captcha/' + (new Date()).getTime())}
                                                ref={(e) => {
                                                    this.captchaImage = e;
                                                }}
                                                onClick={() => {
                                                    this.getNewCaptcha()
                                                }}
                                                alt=""/>
                                        </p>
                                        <FormControl
                                            type="text"
                                            placeholder="Enter code from image"
                                            name="captcha"
                                        />
                                        {this.getValidationError('captcha')}
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col smOffset={2} sm={10}>
                                        <Button type="submit">
                                            Register
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

export default IndexComponent;