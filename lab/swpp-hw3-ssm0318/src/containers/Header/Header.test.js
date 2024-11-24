import React from 'react';
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "../../store/store";
import { Route, Redirect, Switch } from 'react-router-dom';

import Header from './Header';
import { getMockStore } from '../../test-utils/mocks';
import * as actionCreators from "../../store/actions/user";

const loggedInUser = { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: true };

const stubInitialState = {
    users: [
      { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: true },
      { id: 2, email: "alan@turing.com", password: "iluvswpp", name: "Alan Turing", logged_in: false },
      { id: 3, email: "edsger@dijkstra.com", password: "iluvswpp", name: "Edsger Dijkstra", logged_in: false }
    ],
    articles: [
      { id: 1, author_id: 1, title: '1', content: '1' },
      { id: 3, author_id: 1, title: '3', content: '3' },
      { id: 2, author_id: 0, title: '2', content: '2' },
    ],
    comments: [
      { id: 1, article_id: 1, author_id: 0, content: '1' },
      { id: 3, article_id: 3, author_id: 1, content: '3' },
      { id: 2, article_id: 2, author_id: 0, content: '2' },
    ],
    loggedInUser: loggedInUser,
    selectedArticle: { id: 1, author_id: 1, title: '1', content: '1' },
    lastArticleID: 3,
};

const mockStore = getMockStore(stubInitialState);
const mockNullStore = getMockStore({...stubInitialState, loggedInUser: null});

describe('<Header />', () => {
    let loginHeader, logoutHeader;
    beforeEach(() => {
        loginHeader = (
            <Provider store={mockNullStore}>
                <ConnectedRouter history={history}>
                    <Header />
                </ConnectedRouter>
            </Provider>
        );

        logoutHeader = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Header />
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = mount(loginHeader);
        const wrapper = component.find('.header');
        expect(wrapper.length).toBe(1);
    });

    it(`should call 'clickLoginHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => {});
        const component = mount(loginHeader);
        const wrapper = component.find('#login-redirect-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/login');
    });

    it(`should call 'clickLogoutHandler'`, () => {
        const spyLogout = jest.spyOn(actionCreators, 'logout').mockImplementation(id => { return dispatch => {}; });
        const component = mount(logoutHeader);
        const wrapper = component.find('#logout-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyLogout).toHaveBeenCalledTimes(1);
    });
});