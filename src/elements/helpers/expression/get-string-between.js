/**
 * Gets all the substrings between two substrings
 * @param {String} str
 * @param {String} start
 * @param {String} end
 * @returns Array
 */

import { getIndexes } from "../regex";

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

export function getStrBetweenStack(
  str,
  search = "@if",
  start = "(",
  end = ")"
) {
  let matches = [];
  console.log({str,search})
  let idx = str.indexOf(search);
  str = str.substring(idx + search.length);
  str = str.substring(str.indexOf(start) + 1);
  while (idx > -1) {
    let stack = [1];
    for (let i = 0; i < str.length; i++) {
      let char = str.charAt(i);

      if (char == start) {
        stack.push(i);
      } else if (char == end) {
        stack.pop();
      }
      if (stack.length == 0) {
        
        matches.push(str.slice(0, i));
        idx = str.indexOf(search);
        str = str.substring(idx + search.length);
        str = str.substring(str.indexOf(start) + 1);
        break;
      }
    }
  }

  return matches;
}
