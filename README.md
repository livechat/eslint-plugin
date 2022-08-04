# Liniting rules plugin for TypeScript ESLint by LiveChat

A package of linting rules used in TypeScript ESLint.

## Quick-start


### Installation

```bash
$ npm i --save-dev @livechat/eslint-plugin
```


### Usage example

```json
{
  "plugins": ["@livechat"],
  "rules": {
    "@livechat/no-declare": "error"
  }
}
```


## Linting rules list

| Name                                                           | Description                                   |
| -------------------------------------------------------------- | --------------------------------------------- |
| [`@livechat/no-declare`](#no-declare)                          | Forbids using 'declare' keyword               |


## no-declare

Using 'declare' keyword may be forbidden for all or selected identifiers. You can use it for example to force another methods of declaring global variables, e.g. using 'import' forms.


### Options

```ts
type Options = {
  onlyIdentifiers?: string[];
  excludeIdentifiers?: string[];
};

const defaultOptions: Options = {
  onlyIdentifiers: [];
  excludeIdentifiers: [];
};
```

The rule accepts options with the following properties:

- `onlyIdentifiers` (optional) - If used, only the provided identifiers will be reported. All other identifiers declared with `declare` keyword will be ignored.
- `excludeIdentifiers` (optional) - If used, all identifiers will be reported except those provided in the array. If `onlyIdentifiers` is used, this option is ignored.


### default options

Don't use 'declare' keyword.

<!--tabs-->

#### ❌ Incorrect

```ts
declare const someConst: any;
declare const window: { location };
declare const x, y, z: number;
```

#### ✅ Correct

```ts
import someConst from 'some-lib';
import { window } from 'utils/global-declarations';
const { x, y, z } = window;
```


### onlyIdentifiers

Don't use 'declare' keyword for the provided identifiers.

```json
{
  "@livechat/no-declare": [ "error", { "onlyIdentifiers": [ "window" ] } ]
}
```

<!--tabs-->

#### ❌ Incorrect

```ts
declare const window: any;
declare const window: { location };
```

#### ✅ Correct

```ts
import { window } from 'utils/global-declarations';
declare const someConst: any;
declare const x, y, z: number;
```


### excludeIdentifiers

Don't use 'declare' keyword except for the provided identifiers. If `onlyIdentifiers` is used, this option is ignored.

```json
{
  "@livechat/no-declare": [ "error", { "excludeIdentifiers": [ "someConst" ] } ]
}
```

<!--tabs-->

#### ❌ Incorrect

```ts
declare const window: any;
declare const x, y, z: number;
```

#### ✅ Correct

```ts
import { window } from 'utils/global-declarations';
declare const someConst: any;
```
