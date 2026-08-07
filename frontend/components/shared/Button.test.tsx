import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './button'

test('renders button with correct text', () => {
  const { getByRole } = render(<Button>Click me</Button>)
  expect(getByRole('button', { name: /click me/i })).toBeInTheDocument()
})
