import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayList from './PlayList';

describe('<PlayList />', () => {
  test('it should mount', () => {
    render(<PlayList />);
    
    const playList = screen.getByTestId('PlayList');

    expect(playList).toBeInTheDocument();
  });
});