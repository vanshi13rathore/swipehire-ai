import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { Input } from './input';

describe('Input Component', () => {
  it('renders correctly and takes input', () => {
    render(<Input data-testid="input" placeholder="Type here..." />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Type here...');
  });
});
