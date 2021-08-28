import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreatePlaylist from './CreatePlaylist';

describe('<CreatePlaylist />', () => {
  test('it should mount', () => {
    render(<CreatePlaylist />);
    
    const createPlaylist = screen.getByTestId('CreatePlaylist');

    expect(createPlaylist).toBeInTheDocument();
  });
});