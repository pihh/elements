/**
 * 
 * @param {String} str 
 * @param {String} match 
 * @param {Array} idxs 
 * @returns { Array } index of the ocorrence of the substring
 */

export function getOcorrenceIndexes(str, match = "{{", idxs = []) {
    let index = str.indexOf(match);
    let tmp = str;
    if (index > -1) {
      idxs.push(index);
      tmp = tmp.split("");
      tmp[index] = "*";
      tmp[index + 1] = "*";
      tmp = tmp.join("");
      // tmp[index+1] = '*';
      return getOcorrenceIndexes(tmp, match, idxs);
    }
  
    return idxs;
  }