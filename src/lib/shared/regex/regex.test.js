// import {describe, expect, test} from '@jest/globals';

import { expect, test } from 'vitest'
import { extractPath, validateProp } from "./expressions";


test("demo", () => {
  expect(true).toBe(true);
});

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
];
for (let t of extractPathTests) {
  test("extractPathTests", () => {
    expect(extractPath(t.expression, t.prop)).toBe(t.result);
  });
}
