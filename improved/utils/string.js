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