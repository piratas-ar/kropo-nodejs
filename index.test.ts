// Test file for tgbot utility functions
import { getMessage } from './lib';

describe('getMessage function', () => {
  it('should return string message as-is', () => {
    const result = getMessage("hello world")
    expect(result).toBe("hello world")
  })

  it('should return a string from array', () => {
    const messages = ["hello", "world", "test"]
    const result = getMessage(messages)
    expect(messages).toContain(result)
  })

  it('should return ? for invalid input', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    // @ts-ignore - intentionally passing invalid type
    const result = getMessage(null)
    expect(result).toBe("?")
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
