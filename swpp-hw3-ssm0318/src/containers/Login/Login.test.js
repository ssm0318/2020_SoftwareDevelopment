import React from 'react';
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../../store/store";
import { Route, Redirect, Switch } from 'react-router-dom';

import Login from './Login';
import { getMockStore } from '../../test-utils/mocks';
import * as actionCreators from "../../store/actions/user";

const stubUsers = {
    users: [
        {
            id: 1,
            email: "swpp@snu.ac.kr",
            password: "iluvswpp",
            name: "Software Lover",
            logged_in: false
        },
        {
            id: 2,
            email: "alan@turing.com",
            password: "iluvswpp",
            name: "Alan Turing",
            logged_in: false
        },
        {
            id: 3,
            email: "edsger@dijkstra.com",
            password: "iluvswpp",
            name: "Edsger Dijkstra",
            logged_in: false
        }
    ]
};

const mockStore = getMockStore(stubUsers);

describe('<Login />', () => {
    let login;
    beforeEach(() => {
        login = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Login />
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = mount(login);
        const wrapper = component.find('#login-container').hostNodes();
        const wrapper1 = component.find('#email-input');
        const wrapper2 = component.find('#pw-input');
        expect(wrapper.length).toBe(1);
        expect(wrapper1.length).toBe(1);
        expect(wrapper2.length).toBe(1);
    });

    it(`should set state properly on email input`, () => {
        const email = 'TEST_EMAIL'
        const component = mount(login);
        const wrapper = component.find('#email-input');
        wrapper.simulate('change', { target: { value: email } });
        const newEmailInstance = component.find(Login.WrappedComponent).instance();
        expect(newEmailInstance.state.email).toEqual(email);
        expect(newEmailInstance.state.password).toEqual('');
    });

    it(`should set state properly on password input`, () => {
        const password = 'TEST_PASSWORD'
        const component = mount(login);
        const wrapper = component.find('#pw-input');
        wrapper.simulate('change', { target: { value: password } });
        const newPasswordInstance = component.find(Login.WrappedComponent).instance();
        expect(newPasswordInstance.state.email).toEqual('');
        expect(newPasswordInstance.state.password).toEqual(password);
    });

    it(`should call 'alert' at login attempt`, () => {
        const mockClickDone = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const component = mount(login);
        const wrapper = component.find('#login-button').hostNodes();
        // reference: https://github.com/enzymejs/enzyme/issues/836
        wrapper.simulate('click');
        expect(mockClickDone).toHaveBeenCalledTimes(1);
    });

    it(`should call 'login'`, () => {
        const mockClickDone = jest.spyOn(actionCreators, 'login').mockImplementation((user) => { return dispatch => {}; });
        const component = mount(login);
        component.find(Login.WrappedComponent).instance().setState({ email: "swpp@snu.ac.kr", password: "iluvswpp" });
        const wrapper = component.find('#login-button').hostNodes();
        wrapper.simulate('click');
        expect(mockClickDone).toHaveBeenCalledTimes(1);
    });
})
