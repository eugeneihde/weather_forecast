import { Box, Button, Typography } from '@mui/material'

import styles from '@/assets/css/main.module.css'

const NotFoundPage = () => {
  return (
    <>
      <Box className={styles.main__box}>
        <Typography variant='h1'>404 - Seite nicht gefunden</Typography>
        <Button
          variant='contained'
          href='/'
          className={styles.back_to_homepage__button}
        >
          Zurück zur Startseite
        </Button>
      </Box>
    </>
  )
}

export default NotFoundPage