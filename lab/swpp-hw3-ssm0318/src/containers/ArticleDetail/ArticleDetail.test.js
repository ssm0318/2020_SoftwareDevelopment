import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import ArticleDetail from './ArticleDetail';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/article';

jest.mock('../UserName/UserName', () => {
    return jest.fn(props => {
        return (
            <span className="spyUserName">
                <span className="author-name">Author Name</span>
            </span>
        );
    });
});

jest.mock('../../components/CommentList/CommentList', () => {
    return jest.fn(props => {
        return (
            <span className="spyCommentList">
                <span className="comment-list">Comment List</span>
            </span>
        );
    });
});

jest.mock('../CommentCreate/CommentCreate', () => {
    return jest.fn(props => {
        return (
            <span className="spyCommentCreate">
                <span className="comment-create">comment-create</span>
            </span>
        );
    });
});

const selectedArticle1 = { id: 1, author_id: 1, title: '1', content: '1' };
const selectedArticle2 = { id: 2, author_id: 0, title: '2', content: '2' };
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
    selectedArticle: selectedArticle1,
    lastArticleID: 3,
};

const match = {
    params: { id: 1 }
};

const mockAuthorStore = getMockStore(stubInitialState);
const mockViewerStore = getMockStore({ ...stubInitialState, selectedArticle: selectedArticle2 });

describe('<ArticleDetail />', () => {
    let authorArticle, viewerArticle, spyGetArticle;

    beforeEach(() => {
        authorArticle = (
            <Provider store={mockAuthorStore}>
                <ConnectedRouter history={history}>
                    <ArticleDetail match={match} />
                </ConnectedRouter>
            </Provider>
        );

        viewerArticle = (
            <Provider store={mockViewerStore}>
                <ConnectedRouter history={history}>
                    <ArticleDetail match={match} />
                </ConnectedRouter>
            </Provider>
        );

        spyGetArticle = jest.spyOn(actionCreators, 'getArticle')
            .mockImplementation((id) => { return dispatch => {}; });
    });

    afterEach(() => {
        jest.clearAllMocks();
    }); 

    it('should render authorized mode of ArticleDetail without error', () => {
        const component = mount(authorArticle);
        const wrapper = component.find('.article-detail').hostNodes();
        const back = component.find('#back-detail-article-button').hostNodes();
        const editButton = component.find('#edit-article-button').hostNodes();
        const deleteButton = component.find('#delete-article-button').hostNodes();
        const title = component.find('#article-title').hostNodes();
        const author = component.find('#article-author').hostNodes();
        const content = component.find('#article-content').hostNodes();
        expect(wrapper.length).toBe(1);
        expect(back.length).toBe(1);
        expect(editButton.length).toBe(1);
        expect(deleteButton.length).toBe(1);
        expect(title.length).toBe(1);
        expect(author.length).toBe(1);
        expect(content.length).toBe(1);
    });

    it('should render `unauthorized` mode of ArticleWrite without error', () => {
        const component = mount(viewerArticle);
        const wrapper = component.find('.article-detail').hostNodes();
        const back = component.find('#back-detail-article-button').hostNodes();
        const editButton = component.find('#edit-article-button').hostNodes();
        const deleteButton = component.find('#delete-article-button').hostNodes();
        const title = component.find('#article-title').hostNodes();
        const author = component.find('#article-author').hostNodes();
        const content = component.find('#article-content').hostNodes();
        expect(wrapper.length).toBe(1);
        expect(back.length).toBe(1);
        expect(editButton.length).toBe(0);
        expect(deleteButton.length).toBe(0);
        expect(title.length).toBe(1);
        expect(author.length).toBe(1);
        expect(content.length).toBe(1);
    });

    it(`should call 'clickBackHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => {});
        const component = mount(authorArticle);
        const wrapper = component.find('#back-detail-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles');
    });

    it(`should call 'clickEditHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => {});
        const component = mount(authorArticle);
        const wrapper = component.find('#edit-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles/1/edit');
    });

    it(`should disable call of 'deleteArticleHandler'`, () => {
        const mockDeleteArticle = jest.spyOn(actionCreators, 'deleteArticle')
            .mockImplementation((id) => { return dispatch => { }; });
        const component = mount(authorArticle);
        const wrapper = component.find('#delete-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(mockDeleteArticle).toHaveBeenCalledTimes(1);
    });
});


