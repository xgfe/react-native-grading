import 'react-native';
import React from 'react';
import Score from '../Score';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  expect(renderer.create(
    <Score score={4.0} num={72346} fontColor="#552da6" status={1}/>
  )).toMatchSnapshot();
});
