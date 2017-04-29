import React from 'react';
import MainHeaderComponent from './header/Main';
import LoginComponent from './account/Login';
import RegisterComponent from './account/Register';
import FooterComponent from './footer/Main';

class AccountComponent extends React.Component {
    getNewCaptcha() {
        this.captchaImage.setAttribute("src", "");
        this.captchaImage.setAttribute("src", this.props.router.createHref('/captcha/' + (new Date()).getTime()));
    }

    render() {
        return (
            <div className="page page-account">
                <MainHeaderComponent {...this.props} />
                <div className="container">
                    <div className="row">
                        <LoginComponent {...this.props}/>
                        <RegisterComponent {...this.props} />
                    </div>
                </div>
                <FooterComponent {...this.props}/>
            </div>
        );
    }
}

export default AccountComponent;