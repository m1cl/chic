import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Albums from './Albums';

describe('<Albums />', () => {
  test('it should mount', () => {
    render(<Albums />);
    
    const albums = screen.getByTestId('Albums');

    expect(albums).toBeInTheDocument();
  });
});