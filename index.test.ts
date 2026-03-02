// Test file for tgbot utility functions
import { escape, getMessage } from './index';

describe('escape function', () => {
  it('should escape dots', () => {
    expect(escape("hello.world")).toBe("hello\\.world")
  })

  it('should escape exclamation marks', () => {
    expect(escape("hello!world")).toBe("hello\\!world")
  })

  it('should escape underscores', () => {
    expect(escape("hello_world")).toBe("hello\\_world")
  })

  it('should escape asterisks', () => {
    expect(escape("hello*world")).toBe("hello\\*world")
  })

  it('should escape brackets', () => {
    expect(escape("hello[world]")).toBe("hello\\[world\\]")
  })

  it('should escape backticks', () => {
    expect(escape("hello`world")).toBe("hello\\`world")
  })

  it('should handle empty string', () => {
    expect(escape("")).toBe("")
  })

  it('should handle string with no special chars', () => {
    expect(escape("hello world")).toBe("hello world")
  })

  it('should escape all occurrences of special chars', () => {
    expect(escape("hello.world.test")).toBe("hello\\.world\\.test")
  })
})

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
    // @ts-ignore - intentionally passing invalid type
    const result = getMessage(null)
    expect(result).toBe("?")
  })

  it('should return ? for undefined input', () => {
    // @ts-ignore - intentionally passing invalid type
    const result = getMessage(undefined)
    expect(result).toBe("?")
  })
})
