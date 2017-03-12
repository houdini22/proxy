import React from 'react';
import {
    Form,
    FormGroup,
    Col,
    Button,
    ControlLabel,
    FormControl,
    HelpBlock,
    InputGroup
} from 'react-bootstrap';
import {getFormData} from '../../helpers/form-helper';

class LoginComponent extends React.Component {
    constructor() {
        super();
        this.getValidationState = this.getValidationState.bind(this);
        this.state = {
            errors: {},
            user: {}
        };
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({errors: {}});
        const data = getFormData(e);
        this.props.ajax.post('/login', data)
            .then((response) => {
                // action here
                this.props.actions.sessionChanged(true, response.data);
                this.props.router.push('/profile');
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
        let errors = this.state.errors || {};

        let alertError = '';
        if (errors._message) {
            alertError = (
                <div className="alert alert-danger">
                    <p>{errors._message}</p>
                </div>
            );
        }

        let alertConfirmed = '';
        let query = this.props.router.location.query || {};
        if(query.confirmed === "1") {
            alertConfirmed = (
                <div className="alert alert-success">
                    <p>Your account is confirmed now.</p>
                </div>
            );
        }
        return (
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="panel panel-primary panel-register">
                    <div className="panel-heading">
                        <h3 className="panel-title"><i className="fa fa-sign-in"/>Log in</h3>
                    </div>
                    <div className="panel-body">
                        {alertError}
                        {alertConfirmed}
                        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
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

                            <FormGroup className="form-group-sm">
                                <Col smOffset={2} sm={10}>
                                    <Button type="submit" className="btn-sm">
                                        Login
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

export default LoginComponent;