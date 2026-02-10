export {
  getCurrentPosition,
  getCurrentLocation,
  checkGeolocationPermission,
  isGeolocationAvailable,
  reverseGeocode,
} from './api/geolocationApi'

export type {
  Coordinates,
  Location,
  GeolocationOptions,
  GeolocationResult,
  ReverseGeocodeResult,
} from './model/types'

export {
  GeolocationErrorCode,
  GEOLOCATION_ERROR_MESSAGES,
} from './model/types'

export {
  useCurrentPosition,
  useCurrentLocation,
  useGeolocationPermission,
  useAutoGeolocation,
  locationKeys,
} from './model/useGeolocation'