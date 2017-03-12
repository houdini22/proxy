import React from 'react';
import {Link} from 'react-router';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {NavDropdown, Nav, MenuItem, Navbar, NavItem} from 'react-bootstrap';

class MainHeaderComponent extends React.Component {
    className(path) {
        if (this.props.state.currentPath === path) {
            return "active";
        }
        return "";
    }

    render() {
        let {session: {user, isLoggedIn}} = this.props.state;

        if (!user.email) {
            user.email = 'Guest';
        }

        let accountLink = (
            <LinkContainer to="/profile">
                <MenuItem eventKey="1.1">Profile</MenuItem>
            </LinkContainer>
        );
        if (!isLoggedIn) {
            accountLink = (
                <LinkContainer to="/account">
                    <MenuItem eventKey="1.1">Account</MenuItem>
                </LinkContainer>
            );
        }

        return (
            <Navbar fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">ProxyDatabase.net</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav className="nav navbar-nav">
                        <IndexLinkContainer to="/">
                            <NavItem>Home</NavItem>
                        </IndexLinkContainer>
                        <LinkContainer to="/about">
                            <NavItem>About</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavDropdown eventKey="1"
                                     title={<span className="has-icon"><i
                                         className="fa fa-user-o"/> {user.email}</span>}
                                     id="account-dropdown">
                            <MenuItem header> Logged as: {user.email}</MenuItem>
                            {accountLink}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainHeaderComponent;