import React from 'react';
import { shallow } from 'enzyme';

import ArticleCreate from './ArticleCreate';

jest.mock('../../containers/ArticleWrite/ArticleWrite', () => {
    return jest.fn(props => {
        return (
            <div className="spyArticleWrite">
                <div id="back-create-article-button"></div>
                <div id="confirm-create-article-button"></div>
            </div>
        );
    });
});

describe('<ArticleCreate />', () => {
    it('should render without errors', () => {
        const component = shallow(<ArticleCreate lastArticleID={1} />);
        const wrapper = component.find('.article-create');
        expect(wrapper.length).toBe(1);
    });
});

