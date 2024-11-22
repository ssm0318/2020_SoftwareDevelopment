import React, { Component } from "react";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import * as actionCreators from "../../store/actions/index";

import { Navbar, Button } from 'react-bootstrap';  

class Header extends Component {
    onClickLogout = () => {
        this.props.onLogout(this.props.loggedInUser);
    };

    // onClickHomeButton() {
    //     if (window.location.pathname === "/articles") {
    //         window.location.reload();
    //     } else {
    //         this.props.history.push("/articles");
    //     }
    // }

    clickLoginHandler = () => {
        this.props.history.push('/login');
    }

    render() {
        const NavBar = 
            <div className="header">
                {this.props.loggedInUser !== null ?
                    <Navbar bg="light" variant="light">
                        {/* <Navbar.Brand className="home" onClick={() => this.onClickHomeButton()}>Blog Home</Navbar.Brand> */}
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Button variant="outline-secondary" id="logout-button" onClick={() => this.onClickLogout()}>Logout</Button>
                        </Navbar.Collapse>
                    </Navbar>
                    :
                    <Navbar bg="light" variant="light">
                        {/* <Navbar.Brand className="home" onClick={() => this.onClickHomeButton()}>Blog Home</Navbar.Brand> */}
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Button variant="outline-primary" id="login-redirect-button" onClick={() => this.clickLoginHandler()}>Login</Button>
                        </Navbar.Collapse>
                    </Navbar>
                }
            </div>

        return (
            <div>
                {NavBar}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.usr.loggedInUser,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: (id) => dispatch(actionCreators.logout(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));