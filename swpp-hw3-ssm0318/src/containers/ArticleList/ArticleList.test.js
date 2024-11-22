import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import ArticleList from './ArticleList';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/article';

jest.mock('../../components/Article/Article', () => {
    return jest.fn(props => {
        return (
            <div className="article">
                {props.id}
                <div className="titleButton" onClick={props.clickDetail}>{props.title}</div>
            </div>
        );
    });
});

const stubInitialState = {
    articles: [
        { id: 1, author_id: 0, title: 'title 1', content: '1' },
        { id: 3, author_id: 1, title: 'title 3', content: '3' },
        { id: 2, author_id: 0, title: 'title 2', content: '2' },
    ],
};

const mockStore = getMockStore(stubInitialState);

describe('<ArticleList />', () => {
    let articleList;

    beforeEach(() => {
        articleList = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact
                            render={() => <ArticleList />} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = mount(articleList);
        const wrapper = component.find('.ArticleList');
        const articles = component.find('.articles .article')
        expect(wrapper.length).toBe(1);
        expect(articles.length).toBe(3);
        expect(articles.hostNodes().at(0).text()).toBe('3title 3');
        expect(articles.hostNodes().at(1).text()).toBe('2title 2');
        expect(articles.hostNodes().at(2).text()).toBe('1title 1');
    });

    it(`should call 'clickArticleHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push')
            .mockImplementation(path => { });
        const component = mount(articleList);
        const wrapper = component.find('.article .titleButton');
        expect(wrapper.length).toBe(3);
        wrapper.at(0).simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles/3');
    });

    it(`should call 'clickArticleHandler'`, () => {
        const spyHistoryPush = jest.spyOn(history, 'push')
            .mockImplementation(path => { });
        const component = mount(articleList);
        const wrapper = component.find('#create-article-button').hostNodes();
        expect(wrapper.length).toBe(1);
        wrapper.simulate('click');
        expect(spyHistoryPush).toHaveBeenCalledWith('/articles/create');
    });
});

