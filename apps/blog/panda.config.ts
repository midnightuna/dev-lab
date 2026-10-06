import { defineConfig, defineGlobalStyles } from '@pandacss/dev'

const globalCss = defineGlobalStyles({
  html: {
    backgroundColor: 'canvas',
    colorScheme: 'light',
    scrollBehavior: 'smooth',
  },
  body: {
    backgroundColor: 'canvas',
    color: 'text',
    fontFamily: 'sans',
    lineHeight: 'body',
    minWidth: '[320px]',
    textRendering: 'optimizeLegibility',
  },
  '::selection': {
    backgroundColor: 'accent.subtle',
    color: 'text',
  },
})

export default defineConfig({
  preflight: true,
  strictTokens: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  globalCss,
  theme: {
    extend: {
      tokens: {
        colors: {
          paper: {
            50: { value: '#faf9f7' },
            100: { value: '#f1efeb' },
            0: { value: '#ffffff' },
          },
          ink: {
            950: { value: '#171717' },
            700: { value: '#404040' },
            500: { value: '#737373' },
            200: { value: '#d4d4d4' },
          },
          blue: {
            700: { value: '#1d4ed8' },
            100: { value: '#dbeafe' },
          },
        },
        fonts: {
          sans: {
            value:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        },
        fontSizes: {
          sm: { value: '0.875rem' },
          md: { value: '1rem' },
          xl: { value: '1.25rem' },
          display: { value: 'clamp(2.75rem, 8vw, 5.5rem)' },
        },
        fontWeights: {
          regular: { value: '400' },
          medium: { value: '500' },
          bold: { value: '700' },
        },
        lineHeights: {
          body: { value: '1.7' },
          tight: { value: '1.05' },
        },
      },
      semanticTokens: {
        colors: {
          canvas: { value: '{colors.paper.50}' },
          surface: { value: '{colors.paper.0}' },
          text: {
            DEFAULT: { value: '{colors.ink.950}' },
            muted: { value: '{colors.ink.500}' },
          },
          border: { value: '{colors.ink.200}' },
          accent: {
            DEFAULT: { value: '{colors.blue.700}' },
            subtle: { value: '{colors.blue.100}' },
          },
        },
      },
    },
  },
})
