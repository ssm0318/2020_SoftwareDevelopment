import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import ArticleWrite from './ArticleWrite';
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
    lastArticleID: 3,
};

const stubNewArticle = { id: 4, author_id: 2, title: 'title 4', content: 'content 4' };
const stubEditArticle = { id: 1, author_id: 1, title: 'modified title', content: 'modified content' };

const mockStore = getMockStore(stubInitialState);

const mockHistoryPush = { history: { push: jest.fn() } };

describe('<ArticleWrite />', () => {
    let articleCreate, articleEdit;

    beforeEach(() => {
        articleCreate = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history} >
                    <ArticleWrite id={1} title={''} content={''} editing={false} {...mockHistoryPush} />
                </ConnectedRouter>
            </Provider>
        );

        articleEdit = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <ArticleWrite id={1} title={'test'} content={'test'} editing={true} />
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render `create` mode of ArticleWrite without error', () => {
        const component = mount(articleCreate);
        const wrapper = component.find('.article-write');
        const preview = component.find('#preview-tab-button').hostNodes();
        expect(wrapper.length).toBe(1);
        expect(preview.length).toBe(1);
        const articleWriteInstance = component.find(ArticleWrite.WrappedComponent).instance();
        expect(articleWriteInstance.state.title).toEqual('');
        expect(articleWriteInstance.state.content).toEqual('');
    });

    it('should render `edit` mode of ArticleWrite without error', () => {
        const component = mount(articleEdit);
        const wrapper = component.find('.article-write');
        const preview = component.find('#preview-tab-button').hostNodes();
        expect(wrapper.length).toBe(1);
        expect(preview.length).toBe(1);
        const articleWriteInstance = component.find(ArticleWrite.WrappedComponent).instance();
        expect(articleWriteInstance.state.title).toEqual('test');
        expect(articleWriteInstance.state.content).toEqual('test');
    });

    it('should render `write` mode of ArticleWrite without error', () => {
        const component = mount(articleCreate);
        const wrapper = component.find('.write');
        expect(wrapper.length).toBe(1);
    });

    it('should render `preview` mode of ArticleWrite without error', () => {
        const component = mount(articleCreate);
        const wrapper = component.find('#preview-tab-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        const previewInstance = component.find(ArticleWrite.WrappedComponent).instance();
        expect(previewInstance.state.tab).toEqual('preview');
        const preview = component.find('.preview');
        const title = component.find('#article-title').hostNodes();
        const author = component.find('#article-author').hostNodes();
        const content = component.find('#article-content').hostNodes();
        expect(preview.length).toBe(1);
        expect(title.length).toBe(1);
        expect(author.length).toBe(1);
        expect(content.length).toBe(1);
    });

    it('should render `preview` mode of ArticleWrite without error', () => {
        const component = mount(articleCreate);
        const wrapper = component.find('#write-tab-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        const previewInstance = component.find(ArticleWrite.WrappedComponent).instance();
        expect(previewInstance.state.tab).toEqual('write');
        const preview = component.find('.write');
        const title = component.find('#article-title-input');
        const content = component.find('#article-content-input');
        expect(preview.length).toBe(1);
        expect(title.length).toBe(1);
        expect(content.length).toBe(1);
    });

    it(`should call 'postArticle'`, () => {
        const mockPostArticle = jest.spyOn(actionCreators, 'postArticle')
            .mockImplementation((stubNewArticle) => { return dispatch => { }; });
        const component = mount(articleCreate);
        const wrapper = component.find('#confirm-create-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        component.find(ArticleWrite.WrappedComponent).instance().setState({ title: "TEST_TITLE" });
        component.find(ArticleWrite.WrappedComponent).instance().setState({ content: "TEST_CONTENT" });
        wrapper.simulate('click');
        expect(mockPostArticle).toHaveBeenCalledTimes(1);
    });

    it(`should call 'editArticle'`, () => {
        const mockEditArticle = jest.spyOn(actionCreators, 'editArticle')
            .mockImplementation((stubEditArticle) => { return dispatch => { }; });
        const component = mount(articleEdit);
        const wrapper = component.find('#confirm-edit-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        component.find(ArticleWrite.WrappedComponent).instance().setState({ title: "TEST_TITLE" });
        component.find(ArticleWrite.WrappedComponent).instance().setState({ content: "TEST_CONTENT" });
        wrapper.simulate('click');
        expect(mockEditArticle).toHaveBeenCalledTimes(1);
    });

    it(`should disable call of 'editArticle'`, () => {
        const mockEditArticle = jest.spyOn(actionCreators, 'editArticle')
            .mockImplementation((stubEditArticle) => { return dispatch => { }; });
        const component = mount(articleEdit);
        const wrapper = component.find('#confirm-edit-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        component.find(ArticleWrite.WrappedComponent).instance().setState({ title: "" });
        component.find(ArticleWrite.WrappedComponent).instance().setState({ content: "" });
        wrapper.simulate('click');
        expect(mockEditArticle).toHaveBeenCalledTimes(0);
    });

    it(`should call 'createBackHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => {});
        const component = mount(articleCreate);
        const buttons = component.find('.tab-buttons').hostNodes();
        const wrapper = component.find('#back-create-article-button').hostNodes();
        expect(buttons.length).toBe(1);
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles');
    });

    it(`should call with no window confirm in 'editBackHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => {});
        const component = mount(articleEdit);
        const buttons = component.find('.tab-buttons').hostNodes();
        const wrapper = component.find('#back-edit-article-button').hostNodes();
        expect(buttons.length).toBe(1);
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles/1');
    });

    it(`should call confirm true of 'editBackHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(path => {});
        const component = mount(articleEdit);
        const articleWriteInstance = component.find(ArticleWrite.WrappedComponent).instance();
        articleWriteInstance.setState({ title: "TEST_TITLE" });
        articleWriteInstance.setState({ content: "TEST_CONTENT" });
        const mockConfirm = jest.spyOn(window, 'confirm');
        mockConfirm.mockImplementation(jest.fn(() => true));
        const wrapper = component.find('#back-edit-article-button').hostNodes();
        wrapper.simulate('click');
        expect(mockConfirm).toHaveBeenCalledTimes(1);
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles/1');
    });

    it(`should call confirm cancel of 'editBackHandler'`, () => {
        const component = mount(articleEdit);
        const articleWriteInstance = component.find(ArticleWrite.WrappedComponent).instance();
        articleWriteInstance.setState({ title: "TEST_TITLE" });
        articleWriteInstance.setState({ content: "TEST_CONTENT" });
        const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(jest.fn(() => false));
        const wrapper = component.find('#back-edit-article-button').hostNodes();
        wrapper.simulate('click');
        expect(mockConfirm).toHaveBeenCalledTimes(1);
        expect(articleWriteInstance.state.title).toEqual('TEST_TITLE');
        expect(articleWriteInstance.state.content).toEqual('TEST_CONTENT'); 
    });

    it(`should set state properly on title input`, () => {
        const title = 'TEST_TITLE'
        const component = mount(articleCreate);
        const wrapper = component.find('#article-title-input');
        wrapper.simulate('change', { target: { value: title } });
        const newTodoInstance = component.find(ArticleWrite.WrappedComponent).instance();
        expect(newTodoInstance.state.title).toEqual(title);
        expect(newTodoInstance.state.content).toEqual('');
    });

    it(`should set state properly on content input`, () => {
        const content = 'TEST_CONTENT'
        const component = mount(articleCreate);
        const wrapper = component.find('#article-content-input');
        wrapper.simulate('change', { target: { value: content } });
        const articleWriteInstance = component.find(ArticleWrite.WrappedComponent).instance();
        expect(articleWriteInstance.state.title).toEqual('');
        expect(articleWriteInstance.state.content).toEqual(content);
    });
});


