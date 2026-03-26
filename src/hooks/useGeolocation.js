import { useState } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const capture = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        })
        setLoading(false)
      },
      (err) => {
        setError('Could not get location: ' + err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return { location, error, loading, capture }
}
