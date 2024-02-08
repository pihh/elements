import { getPath2 } from "../../../elements/compiler/model/update";
import {
  addCustomListener,
  addModelListener,
  getSelector,
  updateAttribute,
  updateTextNode,
} from "../compiler/elements/dom";
import { findTextNodes } from "../helpers/dom";
import {
  getExpressionProperties,
  getIndexes,
  getStrBetween,
  isChar,
} from "../helpers/regex";

export const hydrate = function () {
  // Get the template of the component
  // Extract the connections
  // Connect to the controller
};

/**
 *
 */
export const connectActions = function (
  $element,
  selector,
  actions = [],
  $connections = { actions: {} }
) {
  for (let action of actions) {
    if (!$connections.actions.hasOwnProperty(selector)) {
      $connections.actions[selector] = [];
    }
    let sourceAttribute = action.replace("@", "").trim();
    let targetAttribute = $element
      .getAttribute(action)
      .trim()
      .replace("this.", "");
    let query = $element
      .getAttribute(action)
      .replaceAll("{{", "${")
      .replaceAll("}}", "}");

    $connections.actions[selector].push({
      type: "action",
      action,
      sourceAttribute,
      targetAttribute,
      query,
      selector: selector,
      setup: function (instance) {
        let element = instance.querySelector(selector);
        if (action.indexOf("model") > -1) {
          const callback = addModelListener(instance, element, targetAttribute);
          element.removeAttribute(action);
          return callback;
        } else {
          let parts = query
            .trim()
            .split("(")
            .map((el) => el.trim())
            .filter((el) => el.length > 0);
          let act = parts[0].replace("this.", "");
          let args = [];
          if (parts.length > 1) {
            args = parts[1]
              .split(")")
              .map((el) => el.trim())
              .filter((el) => el.length > 0)[0]
              .split(",")
              .map((el) => el.trim());
          }
          const callback = () => {
            addCustomListener(
              instance,
              element,
              action.replaceAll("@", ""),
              act,
              args
            );
          };
          callback(instance, element, action.replaceAll("@", ""), act, args);
          element.removeAttribute(action);
          return callback;
        }
      },
    });
  }

  return $connections;
};

export function connectAttributes(
  $element,
  selector,
  attributes = [],
  $connections = { keywords: {} }
) {
  for (let attribute of attributes) {
    const value = $element.getAttribute(attribute);
    const query = value.replaceAll("{{", "${").replaceAll("}}", "}");
    let keywords = getExpressionProperties(value);

    for (let keyword of keywords) {
      if (!$connections.keywords.hasOwnProperty(keyword)) {
        $connections.keywords[keyword] = [];
      }

      $connections.keywords[keyword].push({
        type: "attribute",
        attribute: attribute,
        query,
        selector,
        setup: function (instance) {
          let element = instance.querySelector(selector);
          const callback = function (instance) {
            try {
              //   let element = instance.querySelector(selector);
              updateAttribute(instance, element, attribute, query);
            } catch (ex) {
              console.warn(ex);
            }
          };
          return callback;
        },
      });
    }
  }
  return $connections;
}

/**
 * Removes and maps the *operations in order to create their generators in the future
 * @param {} template
 * @param {*} operations
 * @param {*} attribute
 * @param {*} dataset
 * @param {*} config
 * @returns
 */
let id = 0;
export const disconnectOperations = function (
  template,
  operations,
  attribute,
  dataset,
  config = {}
) {
  config = {
    initial: false,
    ...config,
  };
  let templateId = template.getAttribute("id"); //+'__ifcontainer__'+i
  if (config.initial) {
    template = template.content;
  }

  const $head = document.querySelector("head");
  const $operations = [];
  const attributeName = attribute.replace("*", "").trim();

  // Primeiro Template :
  // Substitui if's de primeiro nivel por um span?
  const connectionSelector = "data-el-template-connection";
  const connectionDataAttribute = "[" + connectionSelector + "]";
  let $rootOperations = {
    connectionSelector: connectionSelector,
    template: template,
    templateId: templateId,
    identifiers: {},
  };
  const getNestedOperations = function (parent, parentId, config = {}) {
    config = {
      root: false,
      ...config,
    };

    const children = [...parent.querySelectorAll("*")].filter(
      (el) => el.getAttributeNames().indexOf(attribute) > -1
    );

    for (let child of children) {
      id++;
      try {
        let childId = child.getAttribute("id");
        if (childId) {
          console.log("has child id already", child);
          continue;
        } else {
          childId = parentId + "__" + id;
        }
        getNestedOperations(child, childId);
        child.setAttribute("id", childId);

        const identifier = parentId + "__nested-operation-map" + "__" + id;
        const placeholder = document.createElement("div");
        const clone = child.cloneNode(true);
        const childTemplate = document.createElement("template");
        const query = child.getAttribute(attribute);

        placeholder.dataset.elTemplateConnection = identifier;
        childTemplate.setAttribute("id", identifier);
        childTemplate.appendChild(clone);
        $head.appendChild(childTemplate);
        parent.querySelector("#" + childId).replaceWith(placeholder);
        if (!$rootOperations.identifiers.hasOwnProperty(identifier)) {
          $rootOperations.identifiers[identifier] = {};
        }
        $rootOperations.identifiers[identifier].query = query;

        $operations.push({
          placeholder: placeholder,
          childTemplate,
          parent: template,
          parentId: templateId,
        });
      } catch (ex) {}
    }
  };

  getNestedOperations(template, templateId, { root: true });
  $rootOperations.childOperations = $operations;

  $rootOperations.id = templateId;
  $rootOperations.operation = attribute;
  $rootOperations.selector;

  $rootOperations.template = template;
  // $rootOperations.$originalElement = $originalElement;
  $rootOperations.initialized = false;

  // Uma limpeza aqui so ficava bem
  $rootOperations.setup = function (instance, element) {
    element = element || instance;
    for (let connection of [
      ...element.querySelectorAll(connectionDataAttribute),
    ]) {
      if (
        $rootOperations[0].identifiers[
          connection.dataset.elTemplateConnection
        ] &&
        $rootOperations[0].operation == "*if"
      ) {

        const $placeholder = document.createComment("");
        $placeholder.identifiers =Object.assign({},$rootOperations[0].identifiers)
        const query =
          $rootOperations[0].identifiers[
            connection.dataset.elTemplateConnection
          ].query;
        // console.log($rootOperations, connection.dataset.elTemplateConnection);
        delete  $placeholder.identifiers[
          connection.dataset.elTemplateConnection
        ];
        const childTemplate = document.head.querySelector(
          "#" + connection.dataset.elTemplateConnection
        );

        const childElement = childTemplate.firstElementChild.cloneNode(true);
   

        const keywords = getExpressionProperties("{{" + query + "}}");

        connection.replaceWith($placeholder);
        // $placeholder.identifiers =Object.assign({},$rootOperations[0].identifiers)

        const callback = function () {
  
          const $fn = Function("return `${" + query + "}`;");
          const $output = $fn.call(instance);
          if (["true", true].indexOf($output) > -1) {
            if (!childElement.isConnected) {
              $placeholder.after(childElement);
            }
          } else {
            if (childElement.isConnected) {
              childElement.remove();
            }
          }
          for (let _identifier of  Object.keys($placeholder.identifiers)) {
            let elementConnections = [
              ...instance.querySelectorAll("[data-el-template-connection]"),
            ];
            for (let ec of elementConnections) {
              if (ec.dataset.elTemplateConnection == _identifier) {
                const _query =
                $placeholder.identifiers[_identifier].query;
                // console.log($rootOperations, connection.dataset.elTemplateConnection);
                delete $placeholder.identifiers[_identifier];
                const _childTemplate = document.head.querySelector(
                  "#" + ec.dataset.elTemplateConnection
                );

                const _childElement =
                  _childTemplate.firstElementChild.cloneNode(true);
                const _$placeholder = document.createComment("");

                const _keywords = getExpressionProperties("{{" + _query + "}}");

                ec.replaceWith(_$placeholder);

                const _callback = function () {
                  const $fn = Function("return `${" + _query + "}`;");
                  const $output = $fn.call(instance);
                  if (["true", true].indexOf($output) > -1) {
                    if (!_childElement.isConnected) {
                      _$placeholder.after(_childElement);
                    }
                  } else {
                    if (_childElement.isConnected) {
                      _childElement.remove();
                    }
                  }
                };
                for (let _keyword of _keywords) {
                  instance.__connect(_keyword, _callback);
                }
                _callback();
              }
            }
          }
        };
        for (let keyword of keywords) {
          instance.__connect(keyword, callback);
        }
        childElement.removeAttribute("*if");
        callback();
        for (let nextNode of [
          ...childElement.querySelectorAll(connectionDataAttribute),
        ]) {
          $rootOperations[0].setup(instance, nextNode);
        }
      }
    }
    // let callback = function () {};
    console.log("setup", $rootOperations);
  };
  $rootOperations = [$rootOperations];

  console.log($rootOperations);
  /*
  function disconnectChildOps(parent){
    const children = [...parent.querySelectorAll('*')].filter(el => el.getAttributeNames().indexOf("*if") > -1);
    for(let child of children){
      const $container = document.createElement('span');
      $container.setAttribute('id',id++);
      if(!child.getAttribute('id')){
        child.setAttribute('id',id++)
      }
      console.log(parent,$container);
      disconnectChildOps(child);
      let template = document.createElement('template');
      template.appendChild(child);
      template.setAttribute('id', id++);
      document.head.appendChild(template);
      child.replaceWith($container)
      //$container.before(child);
      //child.remove();
      debugger;
      $operations.push({
        parent,
        child,
        $container
      })
      
    }

    console.log(parent)
    if(parent){

      let template = document.createElement('template');
      template.appendChild(parent);
      template.setAttribute('id', id++);
      document.head.appendChild(template);
      $operations.push({template})
    }
  }

  disconnectChildOps(template)

  console.log($operations);
  debugger;
  /*
  let disconnect = function(){

  }

  let operationStack = [];

  let createTemplate = function(op){
    const parent = document.createElement('div');
    const container = document.createElement('div');
    const template = document.createElement("template");
    const templateId = 'template-operation--'+id;

    parent.before(op)
    $head.appendChild(template);
    template.appendChild(container);
    template.setAttribute('id',templateId);
    parent.setAttribute('id', 'template-child-operation-container-' + id);
    container.appendChild(op.cloneNode(true));
    id++;

    const operationConfig = {
      template:templateId,
      container:container.id,
      parent:parent.id
    } 
    operationStack.push(operationConfig);
    return parent
  }

  let createOperationTemplate = function(parent){
    const childOperations = [...parent.querySelectorAll('*')].filter(op => op.getAttributeNames().indexOf(attribute) > -1);
    for(let childOperation of childOperations) {
      const child = createOperationTemplate(childOperation)
      console.log({parent,child,operationStack})
    } 
  }

  // let container = document.createElement('div');
  //     container.setAttribute('id', 'child-operation-container-' + id);
  //     id++;
  //     childOperation.before(container);
  for (let i = 0; i < operations.length; i++) {
    createTemplate(operations[i])
    const childOperations = [...operations[i].querySelectorAll('*')].filter(op => op.getAttributeNames().indexOf(attribute) > -1);
    for(let childOperation of childOperations) {
      createOperationTemplate(childOperation)
      
    }
    
    debugger; 
    /*

    const $templateId = templateId + "__" + attributeName + "container__" + i;
    let $template = document.querySelector("#" + $templateId);

    if (!$template) {
      let $originalElement = operations[i].cloneNode(true);
      const $replacement = document.createElement("span");
      $template = document.createElement("template");
      $template.setAttribute("id", $templateId);
      $template.appendChild($originalElement);

      $replacement.dataset.elReplacement = attributeName + "__" + i;
      $originalElement.dataset.elReplacement = attributeName + "__" + i;
    

      $replacement.dataset.elIndex = i;
      $replacement.query = $originalElement
        .getAttribute(attribute)
        .replaceAll("{{", "")
        .replaceAll("}}", "")
        .trim();
      $replacement.query =
        $replacement.query.indexOf("${") == -1
          ? ($replacement.query = "${" + $replacement.query.trim() + "}")
          : $replacement.query;
      $replacement.value =
        "{{" + $originalElement.getAttribute(attribute).trim() + "}}"; //.replaceAll('${','')//;.replaceAll('}}','')
      $originalElement.removeAttribute(attribute);
      // $originalElement.replaceWith($replacement);
      operations[i].replaceWith($replacement);

      

      $head.appendChild($template);

      for(let $nestedOperation of [...operations[i].querySelectorAll('*')].filter(el => el.getAttributeNames().indexOf(attribute)>-1)){
        
        disconnectOperations($nestedOperation,operations,attribute);
      }
    }
    /*
      // let selector = '[data-el-replacement="' + attributeName + "__" + i + '"]'; //$replacement.dataset.elReplacement
      let selector = '[data-el-replacement="'+attributeName+'__'+i+'"]'; //'//[data-el-if]'; //$replacement.dataset.elReplacement
      $operations.push({
        id: $templateId,
        operation: attribute,
        selector,
        query: $replacement.query,
        template: $template,
        $replacement: $replacement,
        $originalElement: $originalElement,
        initialized: false,
        setup: function (instance) {
          let callback = function () {};

          /*
          if(this.initialized) return callback;

          
          const $comment = document.createComment("");
          const $itemTemplate = parseTemplatePointers("", instance, "", {
            templateId: $templateId,
          });
          const $itemConnections = generateTemplateConnectionMap($itemTemplate);
          const $item = $itemTemplate.firstElementChild.cloneNode(true);
          const $placeholder = instance.querySelector(selector);
          $comment.__rehydrate = $comment.__rehydrate || []

          
          const nestedOperations = [...$item.querySelectorAll('*')].filter(el => el.getAttributeNames().indexOf('*if') > -1)

          for(let nestedOperation of nestedOperations) {
            $template.
            // for(let operation of $operations){
            //   if(nestedOperation.innerHTML === operation.$originalElement.innerHTML){
            //     operation.setup(instance);
            //   }
            // }
          }
         

          if(!$placeholder) {
     
            return callback;
          }
          this.initialized = true;
          $placeholder.before($comment);
          $placeholder.remove();
          $comment.after($item);
          applyConnections(instance, $itemConnections)
          
      
   

          if (attribute == "*if") {
            
          
            let keywords = getExpressionProperties($replacement.value);
            callback = function () {

              $comment.__investigateChildren();
              //newValue
              const $fn = Function("return `" + $replacement.query + "`");
              const $output = $fn.call(instance);
              if (["true", true].indexOf($output) > -1) {
                if (!$item.isConnected) {
                  $comment.after($item);

                }
              } else {
                if ($item.isConnected) {
                  $item.remove();
                }
              }
              // for(let i = $comment.__rehydrate.length-1; i >0; i--) {
              //   try{
              //     let attempt = $comment.__rehydrate[i]()
              //     $comment.__rehydrate.splice(i);
              //   }catch(ex){

              //   }
              // }
            };

            // for(let keyword of keywords){
            //    instance.__connect(keyword,callback);
            //  }
          } else {
          }

          return callback;

        },
      });
      //$originalElement.remove();
    }
  }
  */
  return $rootOperations;
};

export const applyConnections = function (instance, connections) {
  instance.scope = instance.scope || {};
  instance.__subscriptions = instance.__subscriptions || [];

  for (let keyword of Object.keys(connections.keywords)) {
    for (let connection of connections.keywords[keyword]) {
      const callback = connection.setup(instance);
      let subscription = instance.__connect(getPath2(keyword), () =>
        callback(instance)
      );
      instance.__subscriptions.push(subscription);
      callback(instance);
    }
  }

  for (let selector of Object.keys(connections.actions)) {
    for (let action of connections.actions[selector]) {
      action.setup(instance);
    }
  }

  for (let op of Object.keys(connections.operations)) {
    for (let operation of connections.operations[op]) {
      console.log(operation);
      
      operation.setup(instance);
    }
  }
};

export function connectTextNodes($node, $connections) {

  let $container = $node.parentNode;

  if (!$container) {
    let $clone = $node.cloneNode(true);
    $container = document.createElement("span");
    $node.replaceWith($container);
    $container.appendChild($clone);
    $node = $clone;
  }
  let parent = getSelector($container);
  let parentChildNodes = $container?.childNodes || [];

  for (let i = 0; i < parentChildNodes.length; i++) {
    let childNode = parentChildNodes[i];
    if (childNode.textContent.indexOf("{{") > -1) {
      const value = childNode.textContent;
      const nodeIndex = i;
      let keywords = getExpressionProperties(value);
      const query = value.replaceAll("{{", "${").replaceAll("}}", "}");
      for (let keyword of keywords) {
        if (!$connections.keywords.hasOwnProperty(keyword)) {
          $connections.keywords[keyword] = [];
        }
        $connections.keywords[keyword].push({
          attribute: "textNode",
          type: "text",
          query,
          originalQuery: value,
          selector: parent, //+"childNodes["+i+"]",
          nodeIndex: nodeIndex,
          setup: function (instance) {
            let element = instance.querySelector(parent).childNodes[nodeIndex];
            let callback = function () {
              updateTextNode(instance, element, query);
            };
            return callback;
          },
        });
      }
    }
  }
  return $connections;
}

const connectIfOperations = function($container,operations=[]){

  const query = $container.getAttribute('*if');
  $container.removeAttribute('*if');
  $container.dataset.elIfDone = operations.length + Date.now();
  delete $container.dataset.elIf
  if(query){
    operations.push({$container,query,setup:function(instance){
      const $placeholder = document.createComment('#if placeholder#');
      const $$container = instance.querySelector('[data-el-if-done="'+$container.dataset.elIfDone+'"]')
    
      const keywords = getExpressionProperties('{{'+query.trim()+'}}');
      if(!$$container) return;
      const callback = function(forceTrue = false){
        const fn = Function('return `${'+query+'}`');
        const output = fn.call(instance);
        if(["true",true].indexOf(output) !== -1 || forceTrue){
          $placeholder.after($$container)
        }else{
          
          if($$container.isConnected){
            $$container.remove();
          }
        }
      }
      $placeholder.before($$container);
      
      for(let keyword of keywords) {
        
        instance.__connect(keyword, callback);
      }
      debugger;
      return callback; 


    }});
  }

  for(let op of [...$container.querySelectorAll("[data-el-if]")]){
    operations = connectIfOperations(op,operations); //
  }

  return operations;
}

// const connectForOperations = function(){
//   const query = $container.getAttribute('*if');
//   $container.removeAttribute('*if');
//   if(query){
//     operations.push({$container,query});
//   }

//   // const $placeholder = document.createComment('if-container');
//   // $placeholder.before(container);

//   for(let op of [...$container.querySelectorAll("[data-el-if]")]){
//     operations = connectIfOperations(op,operations); //
//   }

//   return operations;
// }

/**
 * Get's the original template element and creates a map of it's connections so we don't have to map it
 * everytime a component is connected;
 * @param {*} template
 * @returns
 */
export const generateTemplateConnectionMap = function (template) {
  let $clone = template.content;
  let $operationsIf = [...template.content.querySelectorAll("[data-el-if]")];
  let $operationsFor = [...$clone.querySelectorAll("[data-el-for]")].map(el => el.remove());

  const $connections = {};
  $connections.keywords = {};
  $connections.actions = {};
  $connections.operations = {
    "*if": [],
    "*for": []
  };

  let operations = []

  for(let $container of $operationsIf){
      const query = $container.getAttribute('*if');
      $container.removeAttribute('*if');
      $container.dataset.elIf = operations.length + Date.now();  
      if(query){
        operations.push({$container,query,setup:function(instance){
          const $placeholder = document.createComment('#if placeholder#');
          const $$container = instance.querySelector('[data-el-if="'+$container.dataset.elIf+'"]')
          $$container.before($placeholder);
       
          const keywords = getExpressionProperties('{{'+query.trim()+'}}');
          const callback = function(){
            const fn = Function('return `${'+query+'}`');
            const output = fn.call(instance);
            if(["true",true].indexOf(output) > -1 ){
              $placeholder.before($$container)
            }else{
               $$container.remove();
            }
          }
          
          
          for(let keyword of keywords) {
            instance.__connect(keyword, callback);
          }
    
          
          delete $$container.dataset.elIf 
          return callback;
        }});
      }
  }
  $connections.operations["*if"]= operations 


  // $operationsFor.map((el) => el.remove());
  // Now we get the elements with the generators out of the way
  $clone = template.content;
  let $elements = [...$clone.querySelectorAll("*")];

  for (let $element of $elements) {
    const attributes = $element.getAttributeNames();

    const actions = attributes.filter(
      (attribute) => attribute.indexOf("@") > -1
    );
    const bindings = attributes.filter(
      (attribute) => $element.getAttribute(attribute).indexOf("{{") > -1
    );
    let selector = getSelector($element);
    if (actions && actions.length > 0) {
      connectActions($element, selector, actions, $connections);
    }
    if (bindings && bindings.length > 0) {
      connectAttributes($element, selector, bindings, $connections);
    }
  }

  const $nodes = findTextNodes(template.content).filter(
    (el) => el.textContent.indexOf("{{") > -1
  );

  for (let $node of $nodes) {
    connectTextNodes($node, $connections);
  }

  return $connections;
 
};

/**
 * Checks if the expression is in front of a component defined property
 *
 *
 * @param { String  } template
 * @param { Integer } index
 * @param { String | property on the original template } originalExpression
 * @param { String | property on the parsed template } updatedExpression
 * @returns { String } parsed expression
 */

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

/**
 * Runs once when needs to call the component/element initial template expression parsing and pointers map.
 * Creates a template element to be reused for later when instanciating new components
 *
 * 1- Creates a template element and attached it to the head
 * 2- With the string representation of the component's template.
 * 2.1 - Finds every place where the component has '{{' and get's what actions/props are being used and where on this template.
 * 2.2 - Replaces simple expressions like {{foo}} by {{this.foo}} which is way easier to connect with bindings and events in the connectedCallback stage.
 * 3- Finds operations placement like *if and *for
 * 3.1 - Parses the operation attribute's expression like described above ( without moustaches - in order to avoid collisions in the future stages )
 * 4- Cleans unecessary whitespace on edges
 * 5- Cleans unecessary text nodes between elements
 * 6- Returns the cleaned template.
 *
 * @Once
 *
 * @param {   String    } template
 * @param {   Component } component
 * @param {   String    } selector
 *
 * @returns { String } $template
 * @returns { Void } adds the new template to the header of the HTML page
 */
export const parseTemplatePointers = function (
  template,
  component,
  selector,
  config = {}
) {
  config = {
    templateId: false,
    ...config,
  };
  // Check if exists
  const $templateId = config.templateId || "el-component-template__" + selector;
  const $head = document.querySelector("head");
  let $template = $head.querySelector("#" + $templateId);

  if (!$template) {
    // Component predefined reactivity constants
    const props = component.props || [];
    const actions = component.actions || [];

    // Create the template to be mapped and reused
    $template = document.createElement("template");

    // Find all actions of the template and rewite with the correct synthax
    // if the match is parent tracked, adds the parent pointer
    let matches = getStrBetween(template) || [];

    for (let match of matches) {
      let m = match;
      for (let action of actions) {
        let indexes = getIndexes(match, action);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = parseTemplateString(m, index, action, "this.parent." + action);
          }
        }
      }
      template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
    }

    // Finds all the ocorrences of the reactive properties and replaces them with the
    // correct synthax {{ this.property ...remainder }}
    matches = getStrBetween(template);
    for (let match of matches) {
      let m = match;
      for (let prop of props) {
        let indexes = getIndexes(match, prop);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = parseTemplateString(m, index, prop, "this." + prop);
          }
        }
      }
      template = template.replaceAll("{{" + match + "}}", "{{" + m + "}}");
    }

    // Finds all the ocorrences of the operator *if and replaces with the corresponding expression
    // *if=" this.property ...condition"
    matches = getStrBetween(template, '*if="', '"');
    for (let match of matches) {
      let m = match;
      for (let prop of props) {
        let indexes = getIndexes(match, prop);
        if (indexes.length > 0) {
          indexes.reverse();
          for (let index of indexes) {
            m = parseTemplateString(m, index, prop, "this." + prop);
          }
        }
      }
      template = template.replaceAll(
        '*if="' + match + '"',
        '*if="' + m + '" data-el-if="true"'
      );
    }

    // Finds all the ocorrences of the operator *for and replaces with the corresponding expression
    // *for="targetAttribute of sourceAttribute" - this will require further parsing in the future because of the nested loops
    // let matchIndex
    matches = getStrBetween(template, '*for="', '"');
    for (let match of matches) {
      let m = match.trim();
      let expressionParts = m
        .split(";")
        .map((expression) => expression.trim())
        .filter((expression) => expression.length > 0);
      let queryPart = expressionParts[0];
      let queryParameters = queryPart
        .split(" of ")
        .map((part) => "{" + part.trim() + "}")
        .filter((part) => part.length > 2);

      let targetAttribute = queryParameters[0]
        .replaceAll("{let ", "")
        .replaceAll("{const ", "")
        .replaceAll(" ", "")
        .replaceAll("}", "")
        .replaceAll("{", "");
      let sourceAttribute = queryParameters[1]
        .replaceAll(" ", "")
        .replaceAll("}", "");

      queryPart = targetAttribute + " of " + "this." + sourceAttribute;
      expressionParts[0] = queryPart;
      m = expressionParts.join(";").trim();

      template = template.replaceAll(
        '*for="' + match + '"',
        '*for="' + m + '" data-el-for="true"'
      );
    }

    // Remove unecessary whitespace between elements
    matches = getStrBetween(template, ">", "<");
    for (let match of matches) {
      template = template.replaceAll(
        ">" + match + "<",
        ">" + match.trim() + "<"
      );
    }

    // Remove breakpoints and marginal whitespace
    template = template
      .replaceAll("\\r", "")
      .replaceAll("\\n", "")
      .replaceAll("\r\n", "")
      .replaceAll("  ", " ")
      .trim();

    $template.setAttribute("id", $templateId);
    $template.innerHTML = template;
    $head.appendChild($template);
  }
  return $template;
};
