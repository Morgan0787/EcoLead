export const UZBEKISTAN_ZIPCODES = [
  // Tashkent City
  "100000",
  "100011",
  "100047",
  "100084",
  // Tashkent Region
  "111100",
  "110200",
  "110100",
  // Samarkand
  "140100",
  "140104",
  // Bukhara
  "200100",
  // Fergana Valley
  "150100",
  "170100",
  "160100",
  // Karakalpakstan
  "230100",
] as const;

export type UzbekistanZipcode = (typeof UZBEKISTAN_ZIPCODES)[number];

