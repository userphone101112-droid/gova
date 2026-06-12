/**
 * Example Test
 * 
 * This is an example test file to demonstrate the testing setup.
 * Replace this with your actual tests.
 */

import { render } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'

describe('Example Test', () => {
  it('should render correctly', () => {
    const { container } = render('Hello World')
    expect(container).toBeTruthy()
  })
})
