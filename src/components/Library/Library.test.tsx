import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Library from './Library';

describe('<Library />', () => {
  test('it should mount', () => {
    render(<Library />);
    
    const library = screen.getByTestId('Library');

    expect(library).toBeInTheDocument();
  });
});