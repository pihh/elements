import { filterNonEmpty } from "../array";
import { isChar } from "../regex";
import { getStrBetween } from "./get-string-between";

/**
 * Finds the possible keyword list to be subscribed for listening
 * @param {String} expression
 * @param {String[]} keywords
 * @returns
 */

export const getExpressionProperties = function (expression, keywords = []) {
  const matches = getStrBetween(expression);
  for (let match of matches) {
    const targets = filterNonEmpty(
      match.split("this.").map((el) => el.replaceAll(" ", ""))
    );

    for (let target of targets) {
      let split = target.split("");
      let connected = false;
      for (let i = 0; i < split.length; i++) {
        const c = split[i];
        if (!isChar(c)) {
          if (c == "." || c == "[" || c == "]") {
            //...
            continue;
          } else if (!isNaN(c)) {
            continue;
          } else {
            const keyword = split.slice(0, i).join("");
            if (keywords.indexOf(keyword) == -1) {
              keywords.push(keyword);
            }
            connected = true;
            break;
          }
        }
      }
      if (!connected) {
        const keyword = target.trim();
        if (keywords.indexOf(keyword) == -1) {
          keywords.push(keyword);
        }
      }
    }
  }
  return [...new Set(keywords)];
};
