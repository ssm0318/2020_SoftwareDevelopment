import React from 'react';
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store/store";
import ReactDOM from 'react-dom';

import App from './App';
import * as articleActionCreators from "./store/actions/article";
import * as commentActionCreators from "./store/actions/comment";
import * as userActionCreators from "./store/actions/user";
import { getMockStore } from "./test-utils/mocks";

jest.mock('./containers/Header/Header', () => {
  return jest.fn(props => {
    return (
      <div id="header-container">
        <div className="auth-button">Button</div>
      </div>
    );
  });
});

jest.mock('./containers/Login/Login', () => {
  return jest.fn(props => {
    return (
      <div>
        <div id="login-container">Log in form</div>
      </div>
    );
  });
});

jest.mock('./containers/ArticleList/ArticleList', () => {
  return jest.fn(props => {
    return (
      <div>
        <div id="article=list">Log in form</div>
      </div>
    );
  });
});

jest.mock('./components/ArticleCreate/ArticleCreate', () => {
  return jest.fn(props => {
    return (
      <div>
        <div id="article-create">Article create page</div>
      </div>
    );
  });
});

jest.mock('./containers/ArticleDetail/ArticleDetail', () => {
  return jest.fn(props => {
    return (
      <div>
        <div id="article-detail">Log in form</div>
      </div>
    );
  });
});

jest.mock('./containers/ArticleEdit/ArticleEdit', () => {
  return jest.fn(props => {
    return (
      <div>
        <div id="article-edit">Log in form</div>
      </div>
    );
  });
});

const loggedInUser = { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: true };

const stubInitialState = {
  users: [
    { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: true },
    { id: 2, email: "alan@turing.com", password: "iluvswpp", name: "Alan Turing", logged_in: false },
    { id: 3, email: "edsger@dijkstra.com", password: "iluvswpp", name: "Edsger Dijkstra", logged_in: false }
  ],
  articles: [
    { id: 1, author_id: 0, title: '1', content: '1' },
    { id: 3, author_id: 1, title: '3', content: '3' },
    { id: 2, author_id: 0, title: '2', content: '2' },
  ],
  comments: [
    { id: 1, article_id: 1, author_id: 0, content: '1' },
    { id: 3, article_id: 3, author_id: 1, content: '3' },
    { id: 2, article_id: 2, author_id: 0, content: '2' },
  ],
  loggedInUser: loggedInUser,
  lastCommentID: 3,
  lastArticleID: 3,
};

const stubNullState = { users: null, articles: null, comments: null, loggedInUser: null, lastCommentID: null, lastArticleID: null };

const mockStore = getMockStore(stubInitialState);
const signedOutStore = getMockStore( { ...stubInitialState, loggedInUser: null } );
const mockNullStore = getMockStore(stubNullState);

describe('<App />', () => {
  let visitorApp, userApp, loadingApp;
  let spyGetArticles, spyGetComments, spyGetUsers;
  beforeEach(() => {
    userApp = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <App history={history} {...stubNullState} />
        </ConnectedRouter>
      </Provider>
    );

    visitorApp = (
      <Provider store={signedOutStore}>
        <ConnectedRouter history={history}>
          <App history={history} loggedInUser={loggedInUser} />
        </ConnectedRouter>
      </Provider>
    );

    loadingApp = (
      <Provider store={mockNullStore}>
        <ConnectedRouter history={history}>
          <App history={history} {...stubNullState} />
        </ConnectedRouter>
      </Provider>
    );

    spyGetArticles = jest.spyOn(articleActionCreators, 'getArticles')
      .mockImplementation(() => { return dispatch => {}; });
    spyGetComments = jest.spyOn(commentActionCreators, 'getComments')
      .mockImplementation(() => { return dispatch => {}; });
    spyGetUsers = jest.spyOn(userActionCreators, 'getUsers')
      .mockImplementation(() => { return dispatch => {}; });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render signed in state properly and map initial states to props", () => {
    const component = mount(userApp);
    expect(component.find('.App').length).toBe(1);
  });

  it('should be redirected to error page', () => {
    history.push('/aaa');
    const userComponent = mount(userApp);
    expect(userComponent.find('h1').text()).toBe('Not Found');
  });

  it("should render signed out state properly and map initial states to props", () => {
    const component = mount(visitorApp);
    expect(component.find('.App').length).toBe(1);
  });

  it("should fetch all data upon component mount", () => {
    const component = mount(loadingApp);
    expect(spyGetArticles).toHaveBeenCalledTimes(1);
    expect(spyGetComments).toHaveBeenCalledTimes(1);
    expect(spyGetUsers).toHaveBeenCalledTimes(1);
  });
});
