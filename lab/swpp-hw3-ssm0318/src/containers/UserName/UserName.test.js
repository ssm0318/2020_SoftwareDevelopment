import React, { Component } from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/user';

import UserName from './UserName';

const stubInitialState = {
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
    ],
};

const mockStore = getMockStore(stubInitialState);

describe('<UserName />', () => {
    let userName;

    beforeEach(() => {
        userName = (
            <Provider store={mockStore}>
                <UserName author_id={1}/>
            </Provider>
        );
    })
    afterEach(() => { jest.clearAllMocks() });

    it('should render without errors', () => {
        const component = mount(userName);
        const wrapper = component.find('.author-name');
        expect(wrapper.length).toBe(1);
    });
});

