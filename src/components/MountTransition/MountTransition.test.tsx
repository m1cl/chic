import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MountTransition from './MountTransition';

describe('<MountTransition />', () => {
  test('it should mount', () => {
    render(<MountTransition />);
    
    const mountTransition = screen.getByTestId('MountTransition');

    expect(mountTransition).toBeInTheDocument();
  });
});