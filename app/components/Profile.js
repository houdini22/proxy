import React from 'react';

import MainHeaderComponent from './header/Main';

class ProfileComponent extends React.Component {

    componentWillMount() {
        if (this.props.state.session.isLoggedIn === false) {
            this.props.router.push('/');
        }
    }

    render() {
        return (
            <div>
                <MainHeaderComponent {...this.props} />
                <div className="container" role="main">
                    <div className="well">
                        Profile
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileComponent;