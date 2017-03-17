import React from 'react';
import {Link} from 'react-router';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {NavDropdown, Nav, MenuItem, Navbar, NavItem} from 'react-bootstrap';

class MainHeaderComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            displayUserMenu: false
        };
    }

    className(path) {
        if (this.props.state.currentPath === path) {
            return "active";
        }
        return "";
    }

    handleClickSignOut(e) {
        this.props.ajax.get('/logout')
            .then(() => {
                this.props.actions.sessionChanged(false, {permissions: {}});
                this.props.router.push('/account');
            })
            .catch((error) => {

            });
    }

    render() {
        let {user, isLoggedIn} = this.props.state.session;

        if (!user.email) {
            user.email = 'Guest';
        }

        let userFooter = (
            <li className="user-footer">
                <div className="pull-left">
                    <Link to="/profile" className="btn btn-xs btn-default">
                        <i className="fa fa-user-o"/> Profile
                    </Link>
                </div>
                <div className="pull-right">
                    <a href="#" className="btn btn-xs btn-default" onClick={this.handleClickSignOut.bind(this)}>
                        <i className="fa fa-sign-out"/> Sign out
                    </a>
                </div>
            </li>
        );

        if (!isLoggedIn) {
            userFooter = (
                <li className="user-footer">
                    <div className="pull-right">
                        <Link to="/account" className="btn btn-xs btn-default"><i className="fa fa-sign-in"/> Login or
                            Register</Link>
                    </div>
                </li>
            );
        }

        let memberSince = <small>Member since {user.created_at}</small>;
        if (!isLoggedIn) {
            memberSince = '';
        }

        return (
            <Navbar fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">proxydatabase.online</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav className="nav navbar-nav">
                        <IndexLinkContainer to="/">
                            <NavItem>Home</NavItem>
                        </IndexLinkContainer>
                        <LinkContainer to="/servers">
                            <NavItem><strong>Proxy List</strong></NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <LinkContainer to="/about">
                            <NavItem>About</NavItem>
                        </LinkContainer>
                        <li className="dropdown user user-menu open">
                            <a id="account-dropdown" role="button" className="dropdown-toggle" aria-haspopup="true"
                               onClick={(e) => {
                                   e.preventDefault();
                                   this.setState({
                                       displayUserMenu: !this.state.displayUserMenu
                                   });
                               }}
                               aria-expanded="true" href="#">
                                <span className="has-icon">
                                    <i className="fa fa-user-o"/>
                                </span>
                                <span>{user.email}</span>
                                <span className="caret"/>
                            </a>
                            <ul className="dropdown-menu"
                                style={{display: this.state.displayUserMenu ? 'block' : 'none'}}>
                                <li className="user-header">
                                    <p>
                                        {user.email}
                                        {memberSince}
                                    </p>
                                </li>
                                {userFooter}
                            </ul>
                        </li>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainHeaderComponent;