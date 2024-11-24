import React from 'react';
import { mount } from 'enzyme';

import CommentList from './CommentList';

jest.mock('../../containers/Comment/Comment', () => {
    return jest.fn(props => {
        return (
            <div className="comment">Comment</div>
        )
    });
});

const comments = [
    { id: 1, article_id: 1, author_id: 0, content: '1' },
    { id: 3, article_id: 3, author_id: 1, content: '3' },
    { id: 2, article_id: 2, author_id: 0, content: '2' },
]

describe('<CommentList />', () => {
    it('should render without errors', () => {
        const component = mount(<CommentList comments={comments}/>);
        const wrapper = component.find('.comment');
        expect(wrapper.length).toBe(3);
    });
});

