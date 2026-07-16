import { ARTIST_BIRTH_DATE, MS_PER_YEAR } from "../constants"

export function calculateAge(birthDateIso: string = ARTIST_BIRTH_DATE) {
  return Math.floor((Date.now() - new Date(birthDateIso).getTime()) / MS_PER_YEAR)
}
