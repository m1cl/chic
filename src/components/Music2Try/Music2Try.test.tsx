import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Music2Try from './Music2Try';

describe('<Music2Try />', () => {
  test('it should mount', () => {
    render(<Music2Try />);
    
    const music2Try = screen.getByTestId('Music2Try');

    expect(music2Try).toBeInTheDocument();
  });
});