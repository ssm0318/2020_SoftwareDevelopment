import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import ArticleEdit from './ArticleEdit';

import * as actionCreators from '../../store/actions/article';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';

jest.mock('../../containers/ArticleWrite/ArticleWrite', () => {
    return jest.fn(props => {
        return (
            <div className="spyArticleWrite">
                <div id="back-edit-article-button"></div>
                <div id="confirm-edit-article-button"></div>
            </div>
        );
    });
});

const selectedArticle = { id: 1, author_id: 1, title: 'title 1', content: '1' };

const stubInitialState = {
    articles: [
        { id: 1, author_id: 0, title: 'title 1', content: '1' },
        { id: 3, author_id: 1, title: 'title 3', content: '3' },
        { id: 2, author_id: 0, title: 'title 2', content: '2' },
    ],
    selectedArticle: selectedArticle,
    loggedInUser: { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: true },
};

const stubNullState = {
    articles: [
        { id: 1, author_id: 0, title: 'title 1', content: '1' },
        { id: 3, author_id: 1, title: 'title 3', content: '3' },
        { id: 2, author_id: 0, title: 'title 2', content: '2' },
    ],
    selectedArticle: null,
    loggedInUser: { id: 1, email: "swpp@snu.ac.kr", password: "iluvswpp", name: "Software Lover", logged_in: true },
};

const match = {
    params: { id: 1 }
};

const mockStore = getMockStore(stubInitialState);
const mockNullStore = getMockStore(stubNullState);
const redirectStore = getMockStore( { ...stubInitialState, loggedInUser: { id: 2 } } )

describe('<ArticleEdit />', () => {
    let loadingPage, redirectPage, articleEdit, spyGetArticle;

    beforeEach(() => {
        articleEdit = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact render={() => <ArticleEdit match={match} history={history} />} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );

        loadingPage = (
            <Provider store={mockNullStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact render={() => <ArticleEdit match={match} history={history} />} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );

        redirectPage = (
            <Provider store={redirectStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact render={() => <ArticleEdit match={match} history={history} />} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );

        spyGetArticle = jest.spyOn(actionCreators, 'getArticle')
            .mockImplementation((id) => { return dispatch => {}; });
    })

    it('should render article edit page without errors', () => {
        history.push('/articles/1/edit');
        const component = mount(articleEdit);
        const wrapper = component.find('.article-edit');
        const child = component.find('.spyArticleWrite');
        expect(wrapper.length).toBe(1);
        expect(child.length).toBe(1);
        expect(spyGetArticle).toHaveBeenCalledTimes(1);
    });

    it('should render loading page without errors', () => {
        history.push('/articles/4/edit');
        const component = mount(loadingPage);
        const wrapper = component.find('.loading');
        expect(wrapper.length).toBe(1);
        expect(spyGetArticle).toHaveBeenCalled();
    });

    it('should redirect without errors', () => {
        history.push('/articles/1/edit');
        const component = mount(redirectPage);
        expect(component.find(Redirect)).toHaveLength(1);
    });
});

