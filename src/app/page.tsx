'use client'

import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormGroup, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import CachedIcon from '@mui/icons-material/Cached'

import styles from '@/assets/css/main.module.css'
import { formatDate } from '@/config/config'

const HomePage = () => {
  // fetching related
  const [weatherLocation, setWeatherLocation] = useState<string>('Berlin')
  const [showLocationError, setShowLocationError] = useState<boolean>(false)
  const [processingLocationSearchRequest, setProcessingLocationSearchRequest] = useState<boolean>(false)
  const [weatherDataLoading, setWeatherDataLoading] = useState<boolean>(false)
  const [weatherData, setWeatherData] = useState<any>(undefined)
  const [fetchingError, setFetchingError] = useState<boolean>(false)

  // email related
  const [showEmailSuccess, setShowEmailSuccess] = useState<boolean>(false)
  const [showEmailError, setShowEmailError] = useState<boolean>(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [emailTextFieldLabel, setEmailTextFieldLabel] = useState<string>('Vorhersage per Email erhalten')
  const [email, setEmail] = useState<string>('')
  const [processingEmailSendRequest, setProcessingEmailSendRequest] = useState<boolean>(false)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // dialog related
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [weatherDetailData, setWeatherDetailData] = useState<any>(undefined)

  useEffect(() => {
    fetchWeatherData(weatherLocation)
  }, [])

  const fetchWeatherData = async (weatherLocation: string) => {
    setProcessingLocationSearchRequest(true)
    setFetchingError(false)
    setWeatherDataLoading(true)
    setShowEmailError(false)
    setShowEmailSuccess(false)
  
    await axios.post(
      '/api/fetch-weather',
      {
        weatherLocation: weatherLocation
      },
      {
        validateStatus: (status) => {
          return status >= 200 && status < 500
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        setWeatherData(response.data.data)
        setShowLocationError(false)
      } else if (response.status === 404) {
        setShowLocationError(true)
      } else {
        setFetchingError(true)
        console.log(`Error while fetching. Status Code: ${response.status}`)
      }
    })
    .catch(error => {
      setFetchingError(true)
      console.log(`Failed to fetch data: ${error}`)
    })
    .finally(() => {
      setProcessingLocationSearchRequest(false)
      setWeatherDataLoading(false)
    })
  }

  const handleLocationSearchFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchWeatherData(weatherLocation)
  }

  const handleEmailFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setProcessingEmailSendRequest(true)
    e.preventDefault()

    if (!emailRegex.test(email)) {
      setShowEmailError(true)
      setEmailErrorMessage('Keine gültige Email Adresse!')
      setProcessingEmailSendRequest(false)
      return
    }

    await axios.post(
      '/api/send-email',
      {
        email: email,
        weatherData: weatherData
      },
      {
        validateStatus: (status) => {
          return status >= 200 && status < 500
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        setShowEmailSuccess(true)
      } else {
        setShowEmailError(true)
        setEmailErrorMessage('Fehler beim senden der Email! Bitte erneut versuchen.')
      }
    })
    .catch(error => {
      setShowEmailError(true)
      setEmailErrorMessage('Email konnte nicht versendet werden!')
      console.error(`Failed to send Email: ${error}`)
    })
    .finally(() => {
      setProcessingEmailSendRequest(false)
    })
  }

  const handleOpenDialog = (selectedDate: string) => {
    setIsDialogOpen(true)
    setWeatherDetailData(weatherData.forecast.forecastday.find((day: any) => day.date === selectedDate))
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <Box className={styles.main__box}>
        <Box className={styles.email_notify__box}>
          <FormGroup className={styles.location_search__formgroup}>
            <form onSubmit={handleLocationSearchFormSubmit}>
              <FormControl fullWidth>
                <TextField
                  sx={{
                    width: '30rem',
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': {
                        color: '#000'
                      }
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#000'
                      },
                      '&:hover fieldset': {
                        borderColor: '#000'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000'
                      }
                    }
                  }}
                  required
                  type='text'
                  label='Ort'
                  value={weatherLocation}
                  disabled={processingLocationSearchRequest}
                  onChange={(e) => setWeatherLocation(e.target.value)}
                  inputProps={{ maxLength: 255 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Button
                          type='submit'
                          variant='contained'
                          disabled={processingLocationSearchRequest}
                        >
                          {processingLocationSearchRequest ?
                            <ThreeDots
                              height='25px'
                              width='75px'
                              color='black'
                            />
                          :
                            'Suchen'
                          }
                        </Button>
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
            </form>
          </FormGroup>

          {showEmailError &&
            <Alert
              severity='error'
            >
              {emailErrorMessage}
            </Alert>
          }
          {showEmailSuccess &&
            <Alert
              severity='success'
            >
              Wettervorhersage wurde an die angegebene Email geschickt!
            </Alert>
          }

          {(typeof weatherData !== 'undefined' && !showLocationError && !processingLocationSearchRequest) &&
            <FormGroup className={styles.email_notify__formgroup}>
              <form onSubmit={handleEmailFormSubmit}>
                <FormControl fullWidth>
                  <TextField
                    sx={{
                      width: '30rem',
                      '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                          color: '#000'
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#000'
                        },
                        '&:hover fieldset': {
                          borderColor: '#000'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#000'
                        }
                      }
                    }}
                    required
                    type='email'
                    label={emailTextFieldLabel}
                    value={email}
                    disabled={processingEmailSendRequest}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailTextFieldLabel('Email Adresse eingeben')}
                    onBlur={() => setEmailTextFieldLabel('Vorhersage per Email erhalten')}
                    inputProps={{ maxLength: 255 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Button
                            type='submit'
                            variant='contained'
                            disabled={processingEmailSendRequest}
                          >
                            {processingEmailSendRequest ?
                              <ThreeDots
                                height='25px'
                                width='75px'
                                color='black'
                              />
                            :
                              'Erhalten'
                            }
                          </Button>
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </form>
            </FormGroup>
          }
        </Box>
        <Box>
          {(typeof weatherData !== 'undefined' && !showLocationError && !processingLocationSearchRequest) &&
            <>
              <Typography
                variant='h1'
                className={styles.forecast_header__typography}
              >
                14-Tage Wettervorhersage für {weatherData.location.name}, {weatherData.location.country}
              </Typography>
              <Box className={styles.weather_forecast__box}>
                {weatherData.forecast.forecastday.map((item: any, index: number) => (
                  <Box
                    key={index}
                    onClick={() => handleOpenDialog(item.date)}
                    className={styles.weather_forecast_detail__box}
                  >
                    <Box>
                      <Typography variant='h6'>{formatDate(item.date)}</Typography>
                      <Box className={styles.weather_forecast_icon_temp__box}>
                        <Box
                          component='img'
                          src={item.day.condition.icon}
                        />
                        <Typography><b>{item.day.maxtemp_c}°</b> / {item.day.mintemp_c}°</Typography>
                      </Box>
                      <Typography variant='h6'>{item.day.condition.text}</Typography>
                    </Box>
                    <Box>
                      <Typography><b>Wind:</b> bis zu {item.day.maxwind_kph}km/h</Typography>
                      <Typography><b>Regenwahrscheinlichkeit:</b> {item.day.daily_chance_of_rain}%</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              {typeof weatherDetailData !== 'undefined' &&
                <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth>
                  <DialogTitle className={styles.weather_detail__dialogtitle}>
                    <Typography><b>Wettervorhersage für den {formatDate(weatherDetailData.date)}</b></Typography>
                    <Button
                      variant='contained'
                      onClick={handleCloseDialog}
                    >
                      Schließen
                    </Button>
                  </DialogTitle>
                  <DialogContent className={styles.weather_detail__dialogcontent}>
                    <Box className={styles.dialog_weather__box}>
                      {weatherDetailData.hour.map((item: any, index: number) => (
                        <Box
                          key={index}
                          className={styles.dialog_weather_detail__box}
                        >
                          <Typography variant='h6'>{item.time.split(' ')[1]}</Typography>
                          <Box className={styles.weather_forecast_icon_temp__box}>
                            <Box
                              component='img'
                              src={item.condition.icon}
                            />
                            <Typography><b>{item.temp_c}°</b></Typography>
                          </Box>
                          <Typography variant='h6'>{item.condition.text}</Typography>
                          <Typography><b>Wind:</b> bis zu {item.wind_kph}km/h</Typography>
                          <Typography><b>Regenwahrscheinlichkeit:</b> {item.chance_of_rain}%</Typography>
                        </Box>
                      ))}
                    </Box>
                  </DialogContent>
                </Dialog>
              }
            </>
          }
          {weatherDataLoading &&
            <ThreeDots
              height='75px'
              width='75px'
              color='black'
            />
          }
          {showLocationError &&
            <Alert
              severity='error'
            >
              Kein passendes Ergebnis für die Suche gefunden
            </Alert>
          }
          {fetchingError &&
            <>
              <Alert
                severity='error'
              >
                Wetterdaten konnten nicht abgerufen werden.
              </Alert>
              <Button
                variant='contained'
                onClick={() => fetchWeatherData(weatherData)}
              >
                Erneut versuchen <CachedIcon />
              </Button>
            </>
          }
        </Box>
      </Box>
    </>
  )
}

export default HomePage