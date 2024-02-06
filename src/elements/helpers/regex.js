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

export const initialExpressionCleanup = function (element) {
  // INITIAL CLEANUP

  let innerHTML = element.innerHTML;
  let matches = getStrBetween(innerHTML);
  for (let match of matches) {
    const original = "{{" + match + "}}";
    const replacement = "{{" + match.replaceAll(" ", "") + "}}";
    innerHTML = innerHTML.replaceAll(original, replacement);
  }
  element.innerHTML = innerHTML;

  return element;
};

export function isChar(c) {
  return c.toUpperCase() != c.toLowerCase();
}

export function getIndexes(str, match = "{{", idxs = []) {
  let index = str.indexOf(match);
  let tmp = str;
  if (index > -1) {
    idxs.push(index);
    tmp = tmp.split("");
    tmp[index] = "*";
    tmp[index + 1] = "*";
    tmp = tmp.join("");
    // tmp[index+1] = '*';
    return getIndexes(tmp, match, idxs);
  }

  return idxs;
}

export const getExpressionProperties = function (expression, keywords = []) {
  const matches = getStrBetween(expression);
  for (let match of matches) {
    const targets = match
      .split("this.")
      .map((el) => el.replaceAll(" ", ""))
      .filter((el) => el.length > 0);

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
  return keywords;
};

export const parseTemplateString = function (
  template,
  index,
  originalExpression,
  updatedExpression
) {
  let parsedTemplate = template;
  let nextChar = template.charAt(index + originalExpression.length);
  let prevChar = template.charAt(index - 1);
  let prevValid = index == 0 || (!isChar(prevChar) && prevChar != ".");
  let nextValid =
    index + originalExpression.length > template.length || !isChar(nextChar);
  if (prevValid && nextValid) {
    parsedTemplate = template.split("");
    let leftTemplate = template.slice(0, index);
    let rightTemplate = template.slice(index + originalExpression.length);
    parsedTemplate = leftTemplate + updatedExpression + rightTemplate;
  }
  return parsedTemplate;
};

export const parseTemplateExpressions = function (
  template,
  sourceExpression,
  targetExpression
) {
  let matches = [];
  matches = getStrBetween(template);

  for (let match of matches) {
    let m = match;

    let indexes = getIndexes(match, sourceExpression);
    if (indexes.length > 0) {
      indexes.reverse();
      for (let index of indexes) {
        m = parseTemplateString(m, index, sourceExpression, targetExpression);
      }
    }
    template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
  }

  matches = getStrBetween(template, "(", ")");
  for (let match of matches) {
    let m = match;

    let indexes = getIndexes(match, sourceExpression);
    if (indexes.length > 0) {
      indexes.reverse();
      for (let index of indexes) {
        m = parseTemplateString(m, index, sourceExpression, targetExpression);
      }
    }

    template = template.replaceAll("(" + match + ")", "(" + m + ")");
  }

  // $template.setAttribute("id", "el-component-template__" + selector);
  // $template.innerHTML = template;
  // $head.appendChild($template);

  return template;
};
