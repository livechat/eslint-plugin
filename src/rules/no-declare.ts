import {
  AST_NODE_TYPES,
  ESLintUtils,
} from "@typescript-eslint/experimental-utils";

const createEslintRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/livechat/eslint-plugin#${ruleName}`
);

interface IOptions {
  onlyIdentifiers?: string[];
  excludeIdentifiers?: string[];
}

export default createEslintRule<IOptions[], string>({
  name: "no-declare",
  meta: {
    messages: {
      declareFound: "Using 'declare' is not allowed.",
      declareIdentifierFound:
        "Using 'declare' is not allowed for this identifier: '{{ name }}'.",
    },
    docs: {
      description: "Forbid using 'declare' keyword.",
      recommended: "warn",
    },
    type: "suggestion",
    schema: [
      {
        type: "object",
        properties: {
          onlyIdentifiers: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
            },
          },
          excludeIdentifiers: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string",
            },
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      onlyIdentifiers: [],
      excludeIdentifiers: [],
    },
  ],
  create(context, [options]) {
    const { onlyIdentifiers, excludeIdentifiers } = options;
    const onlyIdentifiersEnabled = !!onlyIdentifiers?.length;
    const excludeIdentifiersEnabled = !!excludeIdentifiers?.length;
    const noIdentifiersSpecified =
      !onlyIdentifiersEnabled && !excludeIdentifiersEnabled;

    return {
      VariableDeclaration(node) {
        if (!node.declare) {
          return;
        }

        if (noIdentifiersSpecified) {
          context.report({
            node,
            messageId: "declareFound",
          });
          return;
        }

        node.declarations.forEach((declaration) => {
          if (declaration.id.type === AST_NODE_TYPES.Identifier) {
            const { name } = declaration.id;

            if (
              (onlyIdentifiersEnabled && onlyIdentifiers.includes(name)) ||
              (!onlyIdentifiersEnabled &&
                excludeIdentifiersEnabled &&
                !excludeIdentifiers.includes(name))
            ) {
              context.report({
                node: declaration,
                messageId: "declareIdentifierFound",
                data: {
                  name,
                },
              });
            }
          }
        });
      },
    };
  },
});
