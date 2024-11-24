import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import UserCommentButton from './UserCommentButton';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/comment';

const stubInitialState = {
    selectedComment: { id: 1, article_id: 1, author_id: 0, content: 'TEST COMMENT' },
};

const modifiedComment = { id: 1, article_id: 1, author_id: 0, content: 'MODIFIED COMMENT' };

const mockStore = getMockStore(stubInitialState);

describe('<Comment />', () => {
    let userCommentButton, spyGetComment;

    beforeEach(() => {
        userCommentButton = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <UserCommentButton />
                </ConnectedRouter>
            </Provider>
        );

        spyGetComment = jest.spyOn(actionCreators, 'getComment')
            .mockImplementation((id) => { return dispatch => {}; });
    });

    afterEach(() => {
        jest.clearAllMocks();
    }); 

    it('should render without errors', () => {
        const component = mount(userCommentButton);
        const button1 = component.find('#edit-comment-button').hostNodes();
        const button2 = component.find('#delete-comment-button').hostNodes();
        expect(button1.length).toBe(1);
        expect(button2.length).toBe(1);
        expect(spyGetComment).toHaveBeenCalledTimes(1);
    });

    it('should call `editCommentHandler', () => {
        window.prompt = jest.fn();
        const component = mount(userCommentButton);
        const wrapper = component.find('#edit-comment-button').hostNodes();
        wrapper.simulate('click');
        expect(window.prompt).toHaveBeenCalledWith("Edit Comment", "TEST COMMENT");
        window.prompt.mockImplementation((text) => "MODIFIED COMMENT");
        expect(window.prompt).toHaveBeenCalledTimes(1);
    });

    it('should call `deleteCommentHandler', () => {
        const mockDeleteComment = jest.spyOn(actionCreators, 'deleteComment')
            .mockImplementation((id) => { return dispatch => { }; });
        const component = mount(userCommentButton);
        const wrapper = component.find('#delete-comment-button').hostNodes();
        wrapper.simulate('click');
        expect(mockDeleteComment).toHaveBeenCalledTimes(1);
    });
});

