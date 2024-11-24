import React, { Component } from "react";

import { connect } from "react-redux";

import * as actionCreators from "../../store/actions/index";

import { Container, Row, Form, Button } from 'react-bootstrap';

class Login extends Component {
    state = {
        email: "",
        password: "",
    }

    loginHandler = () => {
        if (this.state.email !== 'swpp@snu.ac.kr' || this.state.password !== 'iluvswpp') {
            alert('Email or password is wrong');
        } else {
            const loggingInUser = this.props.users.filter(user => {
                return user.email === this.state.email && user.password === this.state.password;
            });
            this.props.onLogin(loggingInUser[0]);
        }
    };

    render() {
        return (
            <div>
                <Container id="login-container">
                    <Row className="justify-content-md-center">
                        <Form>
                            <Form.Group controlId="email-input">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" placeholder="Enter email" onChange={(e) => this.setState({ email: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="pw-input">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="text" placeholder="Password" onChange={(e) => this.setState({ password: e.target.value })} />
                            </Form.Group>
                            <Button variant="primary" id="login-button" onClick={() => this.loginHandler()}>
                                Enter
                            </Button>
                        </Form>
                    </Row>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.usr.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (user) => dispatch(actionCreators.login(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
