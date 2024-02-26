export const findMatchBetween = function (
  contents,
  start = "{{",
  end = "}}",
  search = ["{", "}"]
) {
  let startIndex = contents.indexOf(start);
  let endIndex = startIndex;
  let output = {
    success: false,
    contents,
    match: contents,
    between: contents,
  };
  if (startIndex > -1) {
    let stack = 0;
    let sl = search[0];
    let sr = search[1];
    for (let i = startIndex; i < contents.length; i++) {
      let char = contents.charAt(i);
      if (char === sl) {
        stack++;
      } else if (char === sr) {
        stack--;
      }
      if (stack === 0) {
        endIndex = i;
        let match = contents.slice(startIndex, endIndex + 1);
        let between = match.slice(start.length, match.length - end.length);
        // console.log("found",{sl,sr,startIndex,endIndex,contents,match,between});
        output.match = match;
        output.between = between.trim();
        output.success = true;
        // debugger;
        break;
      }
    }
  }
  return output;
};

export const findMatchesBetween = function (
  contents,
  start = "{{",
  end = "}}",
  search = ["{", "}"]
) {
  const output = [];
  let loop = 0;
  let maxLoops = 100;
  let keepLooping = true;
  const callback = function (contents, start, end, search) {
    let result = findMatchBetween(contents, start, end, search);
    if (result.success) {
      output.push(result);
      contents = contents.replace(result.match, "");
    }
    return { keepLooping: result.success, contents };
  };
  let result = callback(contents, start, end, search);
  contents = result.contents;
  keepLooping = result.keepLooping;

  while (keepLooping) {
    loop++;
    if (loop > maxLoops) break;
    let result = callback(contents, start, end, search);
    contents = result.contents;
    keepLooping = result.keepLooping;
  }
  return output;
};

export const removeChars = function(string,replacements, replace=""){
  let str = string;
  for(let replacement of replacements){
      str = str.replaceAll(replacement,replace)
  }

  return str;
}