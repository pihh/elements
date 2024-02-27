import { connectionBoilerplateOperation } from "../connect/operation";

const operations = {
  if: {
    search: {
      start: "@if(",
      end: "}",
    },
  },
  for: {
    search: {
      start: "@for(",
      end: "}",
    },
  },
};

/**
 * Extracts method to run and get's it's arguments
 * @param {} expression
 * @returns
 */
let extractOperationArguments = function (expression) {
  /*
    let action;
    if (expression.indexOf("=>{") > -1) {
      action = expression.split("=>{")[1];
      action = action.trim();
    } else {
      action = expression;
    }
  
    let args = action.split("(");
    action = args[0].trim();
    
    if (args.length > 1) {
      args = args[1]
        .replaceAll(")", "")
        .split(",")
        .map((el) => el.trim())
        .filter((el) => el.length > 0);
    } else {
      args = [];
    }
    
    return { parsedAction: action, parsedArgs: args };
    */
};

/**
 * Parses the template and generates the action connector object
 * @param {*} template
 * @param {*} props
 * @param {*} methods
 * @returns
 */
export function parseTemplateOperations(template, props = [], methods = []) {
  let operationIndex = 0;
  let operationIfIndex = template.indexOf("@if");
  let operationForIndex = template.indexOf("@for");
  let connections = {
    "data-el-operation": {
      for: {},
      if: {},
    },
  };
  let loop = 0;
  while (operationForIndex > -1 || operationIfIndex > -1) {
    loop++;
    if (loop > 100) {
      console.log({ operationForIndex, operationIfIndex });
      return;
    }
    if (operationIfIndex == -1) {
      let result = extractOperationFor(template, connections, operationIndex);
      template = result.template;
      connections = result.connections;
      operationIndex = result.operationIndex;
      let indices = reset(template);
      operationIfIndex = indices.operationIfIndex;
      operationForIndex = indices.operationForIndex;
    } else if (operationForIndex == -1) {
      let result = extractOperationIf(template, connections, operationIndex);
      template = result.template;
      connections = result.connections;
      operationIndex = result.operationIndex;
      let indices = reset(template);
      operationIfIndex = indices.operationIfIndex;
      operationForIndex = indices.operationForIndex;
    } else if (operationForIndex < operationIfIndex) {
      // extrai for
      let result = extractOperationFor(template, connections, operationIndex);
      template = result.template;
      connections = result.connections;
      operationIndex = result.operationIndex;
      let indices = reset(template);
      operationIfIndex = indices.operationIfIndex;
      operationForIndex = indices.operationForIndex;
    } else {
      //extrai if
      let result = extractOperationIf(template, connections, operationIndex);
      template = result.template;
      connections = result.connections;
      operationIndex = result.operationIndex;
      let indices = reset(template);
      operationIfIndex = indices.operationIfIndex;
      operationForIndex = indices.operationForIndex;
    }
  }
  return { template, connections };
}

const extractQueryParameters = function (right) {
  let value;
  let expression;

  let entry = right.indexOf("(") + 1;
  let stack = 1;

  for (let i = entry; i < right.length; i++) {
    let char = right.charAt(i);
    if (char == "(") {
      stack++;
    } else if (char == ")") {
      stack--;
    }
    if (stack == 0) {
      value = right.slice(entry, i);
      expression = value.trim();
      right = right.slice(i + 1);

      break;
    }
  }
  return { value, expression, right };
};

const extractOperationIf = function (template, connections, operationIndex) {
  let left = template.split("@if")[0];
  let right = template.split("@if").slice(1).join("@if");
  let value;
  let expression;
  let childTemplate;
  let query = extractQueryParameters(right);

  value = query.value;
  expression = query.expression;
  right = query.right;

  let subTemplateStart = right.indexOf("{") + 1;
  let stack = 1;
  for (let i = subTemplateStart; i < right.length; i++) {
    let char = right.charAt(i);
    if (char == "{") {
      stack++;
    } else if (char == "}") {
      stack--;
    }
    if (stack == 0) {
      childTemplate = right.slice(subTemplateStart, i - 1).trim();
      right = right.slice(i + 1);

  
      let elseIndex = right.indexOf("@else");
      let elseIfIndex = right.indexOf("@elseif");
      /*
      let ifIndex = right.indexOf("@if");
      let expressionStack = [expression];

   
      while(elseIfIndex == 0 || elseIndex == 0){
        expressionStack = expressionStack.filter(e => e.trim().length > 0);
        if(elseIfIndex ===0){
          let exp = right.split('@elseif')[0].split(')')[0];
          right = right.replace('@elseif(','@if('+ expressionStack.map( e => "!"+e).join(' && ') + " && ");
          expressionStack.push(exp);
          expressionStack = expressionStack.filter(e => e.trim().length > 0);
        }else if(elseIndex == 0){
          right = right.replace('@else','@if('+expressionStack.map(e => "!"+e).join(' && ')+")");
        }
        elseIndex = right.indexOf("@else");
        elseIfIndex = right.indexOf("@elseif");
      }
 
      console.log(expressionStack)
      debugger;
      */
      // if (elseIndex > -1 && elseIndex < right.indexOf("{") ) {
   
      //   right = right.replace("@else", "@if(!" + expression + ")");
      // }
      // // if (elseIndex > -1 && elseIndex < right.indexOf("{") &&  elseIndex !== elseIfIndex) {
      // //   // let replacement =
      // //   //   expression.indexOf("!") > -1 ? expression : "!" + expression;
      // //   right = right.replace("@else", "@if(!" + expression + ")");
      // // }
      // // if(elseIfIndex === elseIndex && elseIfIndex > -1 && elseIfIndex < right.indexOf("{")){
      // //   right = right.replace("@elseif(","@if(");
      // // }

      if(elseIndex == 0){
        let replacement = expression.indexOf('==')>-1 ? expression.replace('==','!==') : "!"+expression;
        right = right.replace('@else','@if('+replacement+')');
      
        
      }

      let id = operationIndex;
      template =
        left.trim() +
        '<the-if data-el-operation="' +
        id +
        '" condition="{{' +
        expression +
        '}}">' +
        childTemplate +
        "</the-if>" +
        right.trim();

      connections["data-el-operation"].if = {
        ...connections["data-el-operation"].if,
        ...connectionBoilerplateOperation(
          id,
          [],
          value,
          expression,
          "if",
          childTemplate
        ),
      };
      //   console.log({left,right})
      operationIndex++;
      break;
    }
  }

  return { template, connections, operationIndex };
};

const extractOperationFor = function (template, connections, operationIndex) {
  // extrai operation for
  let left = template.split("@for")[0];
  let right = template.split("@for").slice(1).join("@for");
  let value;
  let expression;
  let childTemplate;
  let query = extractQueryParameters(right);
  value = query.value;
  expression = query.expression;
  right = query.right;

  let subTemplateStart = right.indexOf("{") + 1;
  let stack = 1;
  for (let i = subTemplateStart; i < right.length; i++) {
    let char = right.charAt(i);
    if (char == "{") {
      stack++;
    } else if (char == "}") {
      stack--;
    }
    if (stack == 0) {
      childTemplate = right.slice(subTemplateStart, i - 1).trim();
      right = right.slice(i + 1);
      let id = operationIndex;
      template =
        left.trim() +
        '<option data-el-operation="' +
        id +
        '"></option><!-- El For Placeholder ' +
        id +
        " -->" +
        right.trim();
      connections["data-el-operation"].for = {
        ...connections["data-el-operation"].for,
        ...connectionBoilerplateOperation(
          id,
          [],
          value,
          expression,
          "for",
          childTemplate,
          { index: "__index__" + id }
        ),
      };
      //   console.log({left,right})
      operationIndex++;
      break;
    }
  }

  return { template, connections, operationIndex };
};
const reset = function (template) {
  let operationIfIndex = template.indexOf("@if");
  let operationForIndex = template.indexOf("@for");
  return { operationIfIndex, operationForIndex };
};
/*
    let idx = template.indexOf(actions.search.start);
  
    let actionConnections = {
      "data-el-action": {},
    };
  
    while (idx > -1) {
      let left = template.split(actions.search.start)[0].trim().split(" ");
      let right = template.split(actions.search.start).slice(1);
      let action = left[left.length - 1].trim();
      let selector = 'data-el-action="' + actionIndex + '"';
      right = right.join(actions.search.start);
      left.pop();
      left = left.join(" ") + " " + selector + " ";
      let match = {
        id: actionIndex,
        selector: selector,
        eventName: action,
      };
      actionIndex++;
      let stack = 1;
      for (let i = 0; i < right.length; i++) {
        let char = right.charAt(i);
        if (char === "}") {
          stack--;
        } else if (char === "{") {
          stack++;
        }
        if (stack === 0) {
          match.value = right.slice(0, i);
          match.expression = right.slice(0, i);
          right = right.slice(i + 1);
          template = left + right;
          idx = template.indexOf(actions.search.start);
          let { parsedAction, parsedArgs } = extractActionArguments(
            match.expression
          );
          actionConnections["data-el-action"] = {
            ...actionConnections["data-el-action"],
            ...connectionBoilerplateAction(
              match.id,
              [],
              match.value,
              parsedAction,
              match.eventName,
              parsedArgs
            ),
          };
  
          break;
        }
      }
    }
    return {template, connections:actionConnections};
    */