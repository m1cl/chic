import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RouteTransition from './RouteTransition';

describe('<RouteTransition />', () => {
  test('it should mount', () => {
    render(<RouteTransition />);
    
    const routeTransition = screen.getByTestId('RouteTransition');

    expect(routeTransition).toBeInTheDocument();
  });
});