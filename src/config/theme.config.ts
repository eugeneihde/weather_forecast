'use client'

import { createTheme } from '@mui/material'

export const themeProviderConfig = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    background: {
      default: '#e3e3e3',
    },
    text: {
      primary: '#000',
      secondary: '#000'
    }
  },
  typography: {
    fontFamily: 'varela-round-regular',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 600,
    },
    h2: {
        fontSize: '1.9rem',
        fontWeight: 600,
    },
    h3: {
        fontSize: '1.6rem',
        fontWeight: 600,
    },
    h4: {
        fontSize: '1.4rem',
        fontWeight: 600,
    },
    h5: {
        fontSize: '1.3rem',
        fontWeight: 600,
    },
    h6: {
        fontSize: '1.1rem',
        fontWeight: 600,
    },
  },
})