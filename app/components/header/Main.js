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
                        <NavDropdown eventKey="1" title="Guest" id="account-dropdown">
                            <MenuItem header>Logged as: Guest</MenuItem>
                            <LinkContainer to="/register">
                                <MenuItem eventKey="1.1">Register</MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainHeaderComponent;