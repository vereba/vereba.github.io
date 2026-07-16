export const CAROUSEL_HEIGHT: number
export const CAROUSEL_CONTROL_WIDTH: number
export const THUMB_VISIBLE_COUNT: number
export const activatePagination: boolean
export const artworksPerRow: number
export const artworkRowsPerPage: number
export const newsPerPage: number
export const homeCarouselIntervalMs: number
export const CONTACT_EMAIL: string
export const INSTAGRAM_URL: string
export const ARTIST_BIRTH_DATE: string
export const MS_PER_YEAR: number
export const ARTWORK_PATH_REGEX: string
export const collections: Record<string, string>
export const sizes: Record<string, string>

export interface EventEntry {
  name: string
  place: string
  date: string
}

export interface EventYearGroup {
  year: string
  entries: EventEntry[]
}

export const exhibitions: EventYearGroup[]
export const livePainting: EventYearGroup[]
