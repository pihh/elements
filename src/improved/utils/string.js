export const capitalizeFirstLetter = function (word) {
  word = word.trim();
  const firstLetter = word.charAt(0);

  const firstLetterCap = firstLetter.toUpperCase();

  const remainingLetters = word.slice(1);

  const capitalizedWord = firstLetterCap + remainingLetters;
  return capitalizedWord;
};

export const replaceAllMultiples = function(word, keyValuePairs=[]){
  for(let keyValuePair of keyValuePairs){
    let find = keyValuePair[0];
    let replace = keyValuePair[1];
    word = word.replaceAll(find, replace);
  }
  return word
}

export const isChar = function(char){
  return char.toUpperCase() != char.toLowerCase();
}

export const findBraketIndiceMatches = function (string) {
  return findStackInstance(string, "{", "}");
};

export const findStackInstance = function (string, leftSearch, rightSearch) {
  let stack = 0;
  let index = string.indexOf(leftSearch);
  if (index > -1) {
    stack++;
    index++;
  }
  let result = {
    success: false,
    start: index,
    end: -1,
    expression: "",
  };
  for (let i = index; i < string.length; i++) {
    let char = string.charAt(i);
    if (char === leftSearch) {
      stack++;
    }
    if (char === rightSearch) {
      stack--;
    }
    if (stack === 0) {
      result.success = true;
      result.start = index;
      result.end = i + 1;
      result.expression = string.substring(index, i);
      break;
    }
  }

  return result;
};
