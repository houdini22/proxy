import React from 'react';
import MainHeaderComponent from './header/Main';
import LoginComponent from './account/Login';
import RegisterComponent from './account/Register';

class AccountComponent extends React.Component {
    getNewCaptcha() {
        this.captchaImage.setAttribute("src", "");
        this.captchaImage.setAttribute("src", this.props.router.createHref('/captcha/' + (new Date()).getTime()));
    }

    render() {
        return (
            <div className="page page-register">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <div className="row">
                        <LoginComponent {...this.props}/>
                        <RegisterComponent {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountComponent;