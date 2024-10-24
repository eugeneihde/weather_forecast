import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import * as dotenv from 'dotenv'

import { themeProviderConfig } from '@/config/theme.config'
import styles from '@/assets/css/main.module.css'

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  dotenv.config()

  return (
    <html lang='de'>
      <body>
        <ThemeProvider theme={themeProviderConfig}>
          <CssBaseline />
          <Container className={styles.root__container}>
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout