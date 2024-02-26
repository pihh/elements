
import { filterNonEmpty } from "../../../helpers/array";

import { getExpressionProperties } from "../../../helpers/regex";

import { operationFor } from "./operations/for";
import { operationIf } from "./operations/if";

export class OperationMap {
  stack = { if: [], for: [] };
  map = { if: [], for: [] };
  async onDidConnect(instance) {

    this.map.for.forEach(async (el) => {
      await el.callback();
    });
    this.map.if.forEach(async (el) => {
      await el.callback();
    });
  }
  constructor(instance) {}
  feed(node) {
    // @deprecated
  }
  extractQueryIf(node) {
    const content = filterNonEmpty(node.textContent.split("@if"))[0]
      .split(")")[0]
      .replace("(", "");
    let keywords = getExpressionProperties("{{" + content + "}}");
    let query = content;

    for (let keyword of keywords.sort((a, b) => b - a)) {
      query = query.replaceAll("this.scope." + keyword, keyword);
      query = query.replaceAll("this." + keyword, keyword);
      query = query.replaceAll(keyword, "this." + keyword);
    }
    //query = "${" + query + "}";
    return { query, value: content, keywords: keywords };
  }
  extractQueryFor(node) {
    try {
      const content = filterNonEmpty(node.textContent.split("@for"))[0]
        .split(")")[0]
        .replace("(", "");
      let split = filterNonEmpty(content.split(" of "));

      let variable = split[0];
      if (variable.trim().indexOf("let ") == 0) {
        variable = variable.trim().replace("let ", "");
      }
      if (variable.trim().indexOf("const ") == 0) {
        variable = variable.trim().replace("const ", "");
      }
      let source = split[1];
      let keywords = getExpressionProperties("{{" + source + "}}");
      let query = source;

      for (let keyword of keywords.sort((a, b) => b - a)) {
        query = query.replaceAll("this.scope." + keyword, keyword);
        query = query.replaceAll("this." + keyword, keyword);
        query = query.replaceAll(keyword, "this." + keyword);
      }

      //query = "${" + query + "}";
      return { query, value: content, source, variable, keywords: keywords };
    } catch (ex) {
      console.warn(ex);
    }
  }
  extractQuery(node) {
  
  }
  __connId = 0;
  track(prop, configuration = {}) {
    if (prop == "@for") {
      operationFor(configuration,this.map.for)
    }else if (prop == "@if") {
      operationIf(configuration, this.map.if)

    }
  }
}
