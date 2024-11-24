import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import Comment from './Comment';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/comment';

jest.mock('../UserCommentButton/UserCommentButton', () => {
    return jest.fn(props => {
        return (
            <div className="spyCommentButton">
                <button id="edit-comment-button"></button>
                <button id="delete-comment-button"></button>
            </div>
        );
    });
});

jest.mock('../UserName/UserName', () => {
    return jest.fn(props => {
        return (
            <div className="spyUserName">
                <div className="author-name">Author Name</div>
            </div>
        );
    });
});

const stubInitialState = {
    loggedInUser: { id: 1 },
    selectedComment: { id: 1, article_id: 1, author_id: 0, content: 'TEST COMMENT' },
};

const defaultProps = { id: 1, author_id: 1, content: "test content 1" };
const branchProps = { id: 2, author_id: 2 };

const mockStore = getMockStore(stubInitialState);

describe('<Comment />', () => {
    let commentDefault, commentBranch;

    beforeEach(() => {
        commentDefault = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Comment {...defaultProps}/>
                </ConnectedRouter>
            </Provider>
        );

        commentBranch = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Comment {...branchProps}/>
                </ConnectedRouter>
            </Provider>
        );
    });

    it('should render without errors', () => {
        const component = mount(commentDefault);
        const wrapper = component.find('.comment');
        const button1 = component.find('#edit-comment-button');
        const button2 = component.find('#delete-comment-button');
        const username = component.find('.author-name');
        expect(wrapper.length).toBe(1);
        expect(button1.length).toBe(1);
        expect(button2.length).toBe(1);
        expect(username.length).toBe(1);
    });

    it('should render without errors', () => {
        const component = mount(commentBranch);
        const comment = component.find('.comment');
        const button1 = component.find('#edit-comment-button');
        const button2 = component.find('#delete-comment-button');
        const username = component.find('.author-name');
        const wrapper = component.find('span');
        expect(comment.length).toBe(1);
        expect(button1.length).toBe(0);
        expect(button2.length).toBe(0);
        expect(username.length).toBe(1);
        expect(wrapper.length).toBe(2);
    });
});

