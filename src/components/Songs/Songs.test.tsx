import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Songs from './Songs';

describe('<Songs />', () => {
  test('it should mount', () => {
    render(<Songs />);
    
    const songs = screen.getByTestId('Songs');

    expect(songs).toBeInTheDocument();
  });
});