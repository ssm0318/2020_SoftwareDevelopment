import React from 'react';
import { shallow } from 'enzyme';

import Article from './Article';

describe('<Article />', () => {
    it('should render without errors', () => {
        const component = shallow(<Article />);
        const wrapper = component.find('.article');
        expect(wrapper.length).toBe(1);
    });
});

