// import {describe, expect, test} from '@jest/globals';

import { expect, test } from 'vitest'
import { extractPath, findProps, validateProp } from "./expressions";


test("demo", () => {
  expect(true).toBe(true);
});
let findPropsTests = [
 
  {
    prop:["colors"],
    expression: " colors ",
    result: "colors",
  }, 
  {
    prop:["colors"],
    expression: " colors[0].name[0] ",
    result: "colors[0].name[0]",
  },
  // {
  //   prop: "name",
  //   expression: "name",
  //   result: true,
  // },
  // {
  //   prop: "color",
  //   expression: " colors[0].name ",
  //   result: true,
  // },
  // {
  //   prop: "color",
  //   expression: " color=true ",
  //   result: true,
  // },
  // {
  //   prop: "name",
  //   expression: "name",
  //   result: true,
  // },
];
for (let t of findPropsTests) {
  test("findPropstests", () => {
    console.log(findProps(t.expression, t.prop))
    expect(findProps(t.expression, t.prop)[0].path).toEqual(t.result);
  });
}
let validatePropTests = [
  {
    prop: "color",
    expression: " colors.name ",
    result: false,
  },
  {
    prop: "color",
    expression: " color[0].name ",
    result: true,
  },
  {
    prop: "color",
    expression: " colors[0].name ",
    result: false,
  },
  {
    prop: "color",
    expression: " color=true ",
    result: true,
  },
  {
    prop: "name",
    expression: "name",
    result: true,
  },
];
for (let t of validatePropTests) {
  test("validateProp", () => {
    expect(validateProp(t.expression, t.prop)).toBe(t.result);
  });
}


let extractPathTests = [
  {
    prop: "colors",
    expression: " colors.name ",
    result: "colors.name",
  },
  {
    prop: "name",
    expression: "name",
    result: "name",
  },
  {
    prop: "colors",
    expression: " colors[0].name ",
    result: 'colors[0].name',
  },
  {
    prop: "colors",
    expression: " colors[0] ",
    result: 'colors[0]',
  },
  {
    prop: "color",
    expression: " color.name=true ",
    result: "color.name",
  },
  {
    prop: "color",
    expression: " color.name = true ",
    result: "color.name",
  },
  {
    prop: "color",
    expression: " color.name>2 ",
    result: "color.name",
  },
  {
    prop: "color",
    expression: "    color.name[0]>2     ",
    result: "color.name[0]",
  },
  {
    prop: "color",
    expression: "    color.name[0] 2     ",
    result: "color.name[0]",
  },
  {
    prop: "color",
    expression: "    color.name[0]2     ",
    result: "color.name[0]",
  },
  {
    prop: "color",
    expression: "    color.name[0].2     ",
    result: "color.name[0]",
  },
];
for (let t of extractPathTests) {
  test("extractPathTests", () => {
    expect(extractPath(t.expression, t.prop).path).toBe(t.result);
  });
}
