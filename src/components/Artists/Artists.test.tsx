import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Artists from './Artists';

describe('<Artists />', () => {
  test('it should mount', () => {
    render(<Artists />);
    
    const artists = screen.getByTestId('Artists');

    expect(artists).toBeInTheDocument();
  });
});