import { ESLintUtils } from "@typescript-eslint/utils";
import noDeclareRule from "./no-declare";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("no-declare", noDeclareRule, {
  valid: [
    {
      name: "No 'declare' keyword used",
      code: "import x from 'some-lib'",
    },
    {
      name: "'declare' keyword used, but identifier is not on the list",
      code: "declare const x: any",
      options: [
        {
          onlyIdentifiers: ["y"],
        },
      ],
    },
    {
      name: "identifiers ignored when on the excluded list",
      code: "declare const x, y, z: any",
      options: [
        {
          excludeIdentifiers: ["y", "x", "z"],
        },
      ],
    },
  ],
  invalid: [
    {
      name: "'declare' keyword used",
      code: "declare const x: any",
      errors: [{ messageId: "declareFound" }],
    },
    {
      name: "'declare' keyword used with destructured object",
      code: "declare const window: { location };",
      errors: [{ messageId: "declareFound" }],
    },
    {
      name: "multiple declarations",
      code: "declare const x, y, z: any",
      errors: [{ messageId: "declareFound" }],
    },
    {
      name: "identifier is on the list",
      code: "declare const x: any",
      errors: [{ messageId: "declareIdentifierFound" }],
      options: [
        {
          onlyIdentifiers: ["x"],
        },
      ],
    },
    {
      name: "multiple identifiers on the list",
      code: "declare const x, y, z: any",
      errors: [
        { messageId: "declareIdentifierFound", data: { name: "x" } },
        { messageId: "declareIdentifierFound", data: { name: "z" } },
      ],
      options: [
        {
          onlyIdentifiers: ["x", "z"],
        },
      ],
    },
    {
      name: "identifiers selectively ignored when on the excluded list",
      code: "declare const x, y, z: any",
      errors: [{ messageId: "declareIdentifierFound", data: { name: "y" } }],
      options: [
        {
          excludeIdentifiers: ["x", "z"],
        },
      ],
    },
    {
      name: "excluded identifiers are ignored when 'only' list is provided",
      code: "declare const x, y, z: any",
      errors: [{ messageId: "declareIdentifierFound", data: { name: "x" } }],
      options: [
        {
          onlyIdentifiers: ["x"],
          excludeIdentifiers: ["z"],
        },
      ],
    },
  ],
});
