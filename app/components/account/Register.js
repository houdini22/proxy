import React from 'react';
import {
    Form,
    FormGroup,
    Col,
    Checkbox,
    Button,
    ControlLabel,
    FormControl,
    HelpBlock,
    InputGroup
} from 'react-bootstrap';
import {getFormData} from '../../helpers/form-helper';

class RegisterComponent extends React.Component {
    constructor() {
        super();
        this.getValidationState = this.getValidationState.bind(this);
        this.state = {
            errors: {},
            alertSuccess: false
        };
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({errors: {}});
        const data = getFormData(e);
        this.props.ajax.post('/register', data)
            .then((response) => {
                this.setState({
                    alertSuccess: true
                });
            })
            .catch((error) => {
                this.setState({
                    errors: error.response ? error.response.data : {}
                });
            });
    }

    getNewCaptcha() {
        this.captchaImage.setAttribute("src", "");
        this.captchaImage.setAttribute("src", this.props.router.createHref('/captcha/' + (new Date()).getTime()));
        this.inputCaptcha.value = "";
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
        let alertSuccess = '';
        if(this.state.alertSuccess) {
            alertSuccess = (
                <div className="alert alert-success">
                    <p>You are registered now. Check your email for confirmation link.</p>
                </div>
            );
        }

        let alertInfo = '';
        if(!this.state.alertSuccess) {
            alertInfo = (
                <div className="alert alert-info">
                    <p><i className="fa fa-info-circle"/>Email is required for account confirmation.</p>
                </div>
            );
        }

        return (
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="panel panel-primary panel-register">
                    <div className="panel-heading">
                        <h3 className="panel-title"><i className="fa fa-user-plus"/>Create account for free!</h3>
                    </div>
                    <div className="panel-body">
                        {alertSuccess}
                        {alertInfo}
                        <Form horizontal onSubmit={this.onSubmit.bind(this)} ref={(element) => {
                            this.form = element;
                        }}>
                            <FormGroup controlId="formHorizontalEmail" className="form-group-sm"
                                       validationState={this.getValidationState('email')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email
                                </Col>
                                <Col sm={10}>
                                    <InputGroup className="input-group-sm">
                                        <InputGroup.Addon><i className="fa fa-envelope"/></InputGroup.Addon>
                                        <FormControl
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                        />
                                    </InputGroup>
                                    {this.getValidationError('email')}
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalEmailRepeat" className="form-group-sm"
                                       validationState={this.getValidationState('email_repeat')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Repeat email
                                </Col>
                                <Col sm={10}>
                                    <InputGroup className="input-group-sm">
                                        <InputGroup.Addon><i className="fa fa-envelope"/></InputGroup.Addon>
                                        <FormControl
                                            type="email"
                                            placeholder="Repeat email"
                                            name="email_repeat"
                                        />
                                    </InputGroup>
                                    {this.getValidationError('email_repeat')}
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalPassword" className="form-group-sm"
                                       validationState={this.getValidationState('password')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Password
                                </Col>
                                <Col sm={10}>
                                    <InputGroup className="input-group-sm">
                                        <InputGroup.Addon><i className="fa fa-lock"/></InputGroup.Addon>
                                        <FormControl
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                        />
                                    </InputGroup>
                                    {this.getValidationError('password')}
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalPasswordRepeat" className="form-group-sm"
                                       validationState={this.getValidationState('password_repeat')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Repeat password
                                </Col>
                                <Col sm={10}>
                                    <InputGroup className="input-group-sm">
                                        <InputGroup.Addon><i className="fa fa-lock"/></InputGroup.Addon>
                                        <FormControl
                                            type="password"
                                            placeholder="Repeat password"
                                            name="password_repeat"
                                        />
                                    </InputGroup>
                                    {this.getValidationError('password_repeat')}
                                </Col>
                            </FormGroup>

                            <FormGroup className="form-group-sm">
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

                            <FormGroup validationState={this.getValidationState('captcha')} className="form-group-sm">
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
                                        ref={(input) => {
                                            this.inputCaptcha = input;
                                        }}
                                    />
                                    {this.getValidationError('captcha')}
                                </Col>
                            </FormGroup>

                            <FormGroup className="form-group-sm">
                                <Col smOffset={2} sm={10}>
                                    <Button type="submit" className="btn-sm">
                                        Register
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterComponent;