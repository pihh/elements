/**
 * Gets all the substrings between two substrings
 * @param {String} str
 * @param {String} start
 * @param {String} end
 * @returns Array
 */

export function getStrBetween(str, start = "{{", end = "}}") {
  let matches = [];
  try {
    matches = str
      .split(start)
      .slice(1)
      .map((el) => el.split(end)[0]); //.trim());
  } catch (e) {}

  return matches || [];
}
