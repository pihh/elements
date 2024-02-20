import { connectionBoilerplateAttribute } from "../connect/attribute";
import { connectionBoilerplateText } from "../connect/text";

const actions = {
  search: {
    start: "={",
    end: "}",
  },
};
/**
 * Extracts method to run and get's it's arguments
 * @param {} expression
 * @returns
 */
let extractAttributeArguments = function (expression) {
  let action;

  return { parsedAction: action, parsedArgs: args };
};

let extractProps = function (value, props) {
  let expression = " " + value.split("{{")[1].split("}}")[0].trim();
  let expressionProps = expression
    .split(" ")
    .map((el) => el.trim().replaceAll("!", ""))
    .filter((el) => el.length > 0)
    .filter((el) => props.indexOf(el.split(".")[0].split("[")[0]) > -1);
  return expressionProps;
};

/**
 * Parses the template and generates the action connector object
 * @param {*} template
 * @param {*} props
 * @param {*} methods
 * @returns
 */
export function parseTemplateAttributes(template, props = [], methods = []) {
  let attributeIndex = 0;

  let connections = {
    "data-el-attribute": {},
    "data-el-text": {},
  };

  const $placeholder = document.createElement("div");
  $placeholder.innerHTML = template;

  let $elements = [...$placeholder.querySelectorAll("*")];
  for (let $element of $elements) {
    for (let node of [...$element.childNodes]) {
      if (node.nodeType === 3) {
        const value = node.textContent;
        if (value.indexOf("{{") > -1) {
          let parent = node.parentElement;
          let nodeIndex = 0;
          parent.childNodes.forEach((n, i) => {
            if (n == node) {
              nodeIndex = i;
            }
          });
          const expression = value
            .replaceAll("{{", "${this.")
            .replaceAll("}}", "}")
            .replaceAll("this.!", "!this.");
          const expressionProps = extractProps(value, props);
          if (!parent.dataset.elText) {
            parent.dataset.elText = "";
          }
          let dataset = parent.dataset?.elText || "";
          dataset = dataset.split(",").filter((el) => el.trim().length > 0);
          let id = attributeIndex;
          attributeIndex++;
          dataset.push(id);
          parent.dataset.elText = dataset.join(",");
          connections["data-el-text"] = {
            ...connections["data-el-text"],
            ...connectionBoilerplateText(
              id,
              expressionProps,
              value,
              expression,
              nodeIndex
            ),
          };
        }
      }
    }

    const $attributes = $element.getAttributeNames();
    for (let $attr of $attributes) {
      let value = $element.getAttribute($attr);
      if (value.indexOf("{{") > -1) {
        if (!$element.dataset.elAttribute) {
          $element.dataset.elAttribute = "";
        }
        let dataset = $element.dataset?.elAttribute || "";
        dataset = dataset.split(",").filter((el) => el.trim().length > 0);
        //$element.dataset.elAttribute = $element.dataset.elAttribute.split(',') || []
        let id = attributeIndex;
        attributeIndex++;
        let expression = " " + value.split("{{")[1].split("}}")[0].trim();
        let expressionProps = expression
          .split(" ")
          .map((el) => el.trim().replaceAll("!", ""))
          .filter((el) => el.length > 0)
          .filter((el) => props.indexOf(el.split(".")[0].split("[")[0]) > -1);
        connections["data-el-attribute"] = {
          ...connections["data-el-attribute"],
          ...connectionBoilerplateAttribute(
            id,
            expressionProps,
            value,
            value
              .replaceAll("{{", "${this.")
              .replaceAll("}}", "}")
              .replaceAll("this.!", "!this."),
            $attr
          ),
        };
        dataset.push(id);

        $element.dataset.elAttribute = dataset.join(",");
        $element.setAttribute(
          $attr,
          value
            .replaceAll("{{", "${this.")
            .replaceAll("}}", "}")
            .replaceAll("this.!", "!this.")
        );
        // console.log({$element,dataset})

        // $element.dataset.elAttribute = $element.dataset.elAttribute.join(',');
      }
    }
  }

  template = $placeholder.innerHTML;

  // console.log({ template, connections });
  return { template, connections };
}
