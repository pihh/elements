const model = {
  "data-el-operation-4": {
    type: "for",
    sourceVariable: "colors",
    maskVariable: "_color",
    selector: "[data-el-operation-4]",
    selectorCamel: "elOperation-4",
    listeners: ["colors"],
    localScope: {
      index: 0,
      _color: "colors[0]",
    },
    configuration: {
      "data-el-text-5": {
        type: "text",
        selector: "[data-el-text-5]",
        selectorCamel: "elText-5",
        childNode: 0,
        expression: "${_color}",
        setup(sourceVariable, maskVariable) {
          this.expression.replaceAll(maskVariable, sourceVariable);
          this.listeners.push(sourceVariable);
        },
        listeners: ["_color"],
      },
      "data-el-text-6": {
        type: "text",
        selector: "[data-el-text-6]",
        selectorCamel: "elText-6",
        childNode: 0,
        expression: "${title}",
        listeners: ["title", "colors[2]"],
      },
      "data-el-bind-3": {
        type: "bind",
        event: "input",
        attribute: "value",
        selector: "[data-el-bind-3]",
        selectorCamel: "elBind-3",
        expression: "${_color}",
        listeners: ["_color"],
      },
    },
  },
};

export const extractOperationForVariables = function(query){

    
    let expression = query.split(';')[0].trim();
    let sourceVariable = expression.split(' of ')[1].trim();
    let maskVariable = expression.split(' of ')[0].trim().split(' ').map(el => el.trim());
    maskVariable = maskVariable[maskVariable.length - 1]

    return {sourceVariable,maskVariable}
}