// Suppress browser extension errors in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  console.error = (...args) => {
    const errorString = args.join(' ')
    // Suppress known extension errors
    if (
      errorString.includes('onboarding.js') ||
      errorString.includes('SOURCE_LANG_VI') ||
      errorString.includes('gads-scrapper')
    ) {
      return
    }
    originalError.apply(console, args)
  }
}

export {}
