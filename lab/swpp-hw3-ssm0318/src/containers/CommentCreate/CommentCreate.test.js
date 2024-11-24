 import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import CommentCreate from './CommentCreate';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/comment';

const stubInitialState = { 
    loggedInUser: { id: 1 },
    lastCommentID: 1,
};

const stubNewComment = { id: 2, article_id: 1, author_id: 1, content: "TEST NEW COMMENT" };

const mockStore = getMockStore(stubInitialState);

describe('<CommentCreate />', () => {
    let commentCreate;

    beforeEach(() => {
        commentCreate = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <CommentCreate article_id={1} />
                </ConnectedRouter>
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without errors', () => {
        const component = mount(commentCreate);
        const wrapper = component.find('.comment-create');
        expect(wrapper.length).toBe(1);
    });

    it(`should set state properly on content input`, () => {
        const content = 'TEST_CONTENT'
        const component = mount(commentCreate);
        const wrapper = component.find('#new-comment-content-input');
        wrapper.simulate('change', { target: { value: content } });
        const newCommentCreateInstance = component.find(CommentCreate.WrappedComponent).instance();
        expect(newCommentCreateInstance.state.content).toEqual(content);
    });

    it(`should call 'postComment'`, () => {
        const spyPostComment = jest.spyOn(actionCreators, 'postComment')
          .mockImplementation(stubNewComment => { return dispatch => {}; });
        const component = mount(commentCreate);
        component.find(CommentCreate.WrappedComponent).instance().setState({ content: "test content" });
        const wrapper = component.find('#confirm-create-comment-button').hostNodes();
        wrapper.simulate('click');
        expect(spyPostComment).toHaveBeenCalledTimes(1);
    });
});

