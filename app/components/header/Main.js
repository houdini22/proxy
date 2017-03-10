import React from 'react';
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
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
            <Navbar inverse fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">ProxyDatabase.net</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav className="nav navbar-nav">
                        <LinkContainer to="/">
                            <NavItem>Home</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <NavItem>About</NavItem>
                        </LinkContainer>
                    </Nav>
                    <Nav pullRight>
                        <NavDropdown eventKey="1" title="Account" id="account-dropdown">
                            <MenuItem eventKey="1.1">Action</MenuItem>
                            <MenuItem eventKey="1.2">Another action</MenuItem>
                            <MenuItem eventKey="1.3" active>Active Item</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey="1.4">Separated link</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainHeaderComponent;