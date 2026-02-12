export type {
  District,
  SearchResult,
} from './model/districtTypes'

export {
  geocodeAddress,
} from './api/geolocationApi'

export {
  useAutoGeolocation,
} from './model/useGeolocation'

export {
  useDistrictSearch,
} from './model/useDistrictSearch'

export {
  highlightText,
} from './lib/searchDistricts'