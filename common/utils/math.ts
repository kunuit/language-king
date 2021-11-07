/**
 *
 * @param {number} min
 * @param {number} max
 * @returns one number from min to max (0,3) => 0|1|2
 */
export const RandomInt = function (min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const SearchRegex = function (string: string) {
  return `/${string}/gi`;
};
