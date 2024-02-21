const operationQuery = { queryEnd: "){", leftSearch: "{", rightSearch: "}" };
export const ruleSet = {
  expression: {
    leftSearch:"{{",
    rightSearch:"}}",
  },
  bind: "*",
  event: {
    leftSearch: " ",
    rule: '="{',
    rightSearch: '}"',
    exclude: "{{",
  },
  customEvent: {
    leftSearch: " (",
    rule: ')="{',
    rightSearch: '}"',
  },
  operation: {
    if: {
        operation:"if",
      queryStart: "@if(",
      ...operationQuery,
    },
    for: {
        operation:"for",
      queryStart: "@for(",
      ...operationQuery,
    },
  },
  cleanup: "$$__pihh__3,14__$$",
};
