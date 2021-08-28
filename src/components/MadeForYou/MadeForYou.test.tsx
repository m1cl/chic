import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MadeForYou from './MadeForYou';

describe('<MadeForYou />', () => {
  test('it should mount', () => {
    render(<MadeForYou />);
    
    const madeForYou = screen.getByTestId('MadeForYou');

    expect(madeForYou).toBeInTheDocument();
  });
});