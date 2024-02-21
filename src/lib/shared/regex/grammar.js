/* IMPORT */

import { grammar } from "grammex";
import escapeRegex from "./string-escape";

/* HELPERS */

const GRAMMARS = {};

/* MAIN */

//TODO: Make grammex type-safe and delete the type assertions
//TODO: Support {{else if ...}}

const makeGrammar = (options = {}) => {
  const grammarId = options.delimiters?.join() || "default";

  return (GRAMMARS[grammarId] ||= grammar(
    ({ match, optional, star, and, or }) => {
      /* DELIMITERS */

      const startDefault = "{{";
      const endDefault = "}}";
      const start = escapeRegex(options.delimiters?.[0] || startDefault);
      const end = escapeRegex(options.delimiters?.[1] || endDefault);
      const withDelimiters = (re) =>
        new RegExp(
          re.source.replaceAll(startDefault, start).replaceAll(endDefault, end)
        );

      /* REGEXES */

      const commentRe = withDelimiters(/{{!--(.*?)--}}/);
      const evalRe = withDelimiters(/{{((?!else}})[^/#{].*?)}}/);
      const stringRe = withDelimiters(/(\{+?(?=\{\{|\{$|$})|(?:(?!{{)[^])+)/);

      const eachOpenRe = withDelimiters(
        /\@for\( (.*?) as ([a-zA-Z$_][a-zA-Z0-9$_]*)\){/
      );
      const eachCloseRe = withDelimiters(/}/);
      const eachElseRe = withDelimiters(/{{else}}/);

      const ifOpenRe = withDelimiters(/{{#if (.*?)}}/);
      const ifCloseRe = withDelimiters(/{{\/if}}/);
      const ifElseRe = withDelimiters(/{{else}}/);

      const withOpenRe = withDelimiters(/{{#with (.*?)}}/);
      const withCloseRe = withDelimiters(/{{\/with}}/);
      const withElseRe = withDelimiters(/{{else}}/);

      /* RULES */

      const Comment = match(commentRe, (_, value) => ({
        type: "comment",
        value,
      }));
      const Eval = match(evalRe, (_, value) => ({ type: "eval", value }));
      const String = match(stringRe, (_, value) => ({ type: "string", value }));

      const EachOpen = match(eachOpenRe, (_, values, value) => ({
        type: "each.open",
        values,
        value,
      }));
      const EachClose = match(eachCloseRe);
      const EachElse = match(eachElseRe);
      const EachBranchTrue = and([EachOpen, () => Values], (nodes) => ({
        type: "each.branch.true",
        values: nodes[0]["values"],
        value: nodes[0]["value"],
        children: nodes.slice(1),
      }));
      const EachBranchFalse = and([EachElse, () => Values], (nodes) => ({
        type: "each.branch.false",
        children: nodes,
      }));
      const Each = and(
        [EachBranchTrue, optional(EachBranchFalse), EachClose],
        (nodes) => ({ type: "each", children: [nodes[0], nodes[1]] })
      );

      const IfOpen = match(ifOpenRe, (_, value) => ({
        type: "if.open",
        value,
      }));
      const IfClose = match(ifCloseRe);
      const IfElse = match(ifElseRe);
      const IfBranchTrue = and([IfOpen, () => Values], (nodes) => ({
        type: "if.branch.true",
        value: nodes[0]["value"],
        children: nodes.slice(1),
      }));
      const IfBranchFalse = and([IfElse, () => Values], (nodes) => ({
        type: "if.branch.false",
        children: nodes,
      }));
      const If = and(
        [IfBranchTrue, optional(IfBranchFalse), IfClose],
        (nodes) => ({ type: "if", children: [nodes[0], nodes[1]] })
      );

      const WithOpen = match(withOpenRe, (_, value) => ({
        type: "with.open",
        value,
      }));
      const WithClose = match(withCloseRe);
      const WithElse = match(withElseRe);
      const WithBranchTrue = and([WithOpen, () => Values], (nodes) => ({
        type: "with.branch.true",
        value: nodes[0]["value"],
        children: nodes.slice(1),
      }));
      const WithBranchFalse = and([WithElse, () => Values], (nodes) => ({
        type: "with.branch.false",
        children: nodes,
      }));
      const With = and(
        [WithBranchTrue, optional(WithBranchFalse), WithClose],
        (nodes) => ({ type: "with", children: [nodes[0], nodes[1]] })
      );

      const Values = star(or([Comment, Eval, String, Each, If, With]));
      const Root = and([Values], (nodes) => ({
        type: "root",
        children: nodes,
      }));

      return Root;
    }
  ));
};

/* EXPORT */

export { makeGrammar };
