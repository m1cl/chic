import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Content from './Content';

describe('<Content />', () => {
  test('it should mount', () => {
    render(<Content />);
    
    const content = screen.getByTestId('Content');

    expect(content).toBeInTheDocument();
  });
});