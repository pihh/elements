import { getStrBetween, isChar } from "../../helpers/regex";

export const parseIndexItem = function (context, variable, source, indexKey) {
    for (let match of getStrBetween(context, 'model="' + variable, '"')) {
      let m = match.trim();
      if (match == "" || !isChar(m.charAt(0))) {
        context = context.replaceAll(
          'model="' + variable + match + '"',
          'model="' + source + "[" + indexKey + "]" + match + '"'
        );
      }
    }
  
    for (let match of getStrBetween(context)) {
      let m = match.trim();
      if (m.indexOf(variable) == 0) {
        if (
          !m.replace(variable, "").charAt(0) ||
          !isChar(m.replace(variable, "").charAt(0))
        ) {
          context = context.replaceAll(
            "{{" + match + "}}",
            "{{" +
              match.replace(variable, "this." + source + "[" + indexKey + "]") +
              "}}"
          ); //.replace('.scope',''));
        }
      }
    }
  
    for (let match of getStrBetween(context, "@for(", ")")) {
      let m = match.trim();
      let query = m.split(" of ")[1].trim();
      if (query.indexOf(variable) == 0) {
        if (
          !query.replace(variable, "").charAt(0) ||
          !isChar(query.replace(variable, "").charAt(0))
        ) {
          query = query.replace(variable, source + "[" + indexKey + "]");
          m = m.split(" of ")[0] + " of " + query;
          context = context.replaceAll("@for(" + match + ")", "@for(" + m + ")"); //.replace('.scope',''));
        }
      }
    }

    for (let match of getStrBetween(context, "@if(", ")")) {
      let m = match.trim();
      if (m.indexOf(variable) == 0) {
        if (
          !m.replace(variable, "").charAt(0) ||
          !isChar(m.replace(variable, "").charAt(0))
        ) {
          context = context.replace(
            "@if(" + match + ")",
            "@if(" +
              match.replace(variable, "this." + source + "[" + indexKey + "]") +
              ")"
          );
        }
      }
    }
    return context;
  };
  