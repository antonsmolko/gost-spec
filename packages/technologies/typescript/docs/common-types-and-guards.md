# Reuse common types and runtime guards

ID: TS-COMMON-001.

Status: proposed (draft; not approved). Level: required.

## Requirement

Projects explicitly adopting the shared-library policy in this requirement
MUST reuse the public types and `guard` methods from `@gost-kit/common` in new or
modified authored TypeScript when they express the required contract exactly.
Projects applying this requirement MUST declare an appropriate dependency on
`@gost-kit/common` before importing it. The standards package distributes documents;
it does not install the runtime library for the consumer.

Do not redeclare an equivalent shared helper or repeat its type expression.
Do not change a domain contract merely to make a helper applicable. Standard
TypeScript utilities such as `Partial`, `Pick`, `Omit` and `ReturnType` remain
appropriate when no common helper adds the required meaning. Do not replace
synchronous return inference with `AsyncReturnType`, or a domain result union
with the library's `Result`, unless their contracts actually match.

Import through `@gost-kit/common`, without depending on private source paths. Use
`import type` for imports containing only types. Combine value and type imports
from the same module using inline `type` specifiers:

```ts
import { guard, type Nlx, type Ulx } from '@gost-kit/common';

type User = { name: string };
type StoredUser = Nlx<User>;
type PendingName = Ulx<string>;

const readName = (value: unknown): PendingName => {
  return guard.string(value) ? value : undefined;
};
```

Organize type definitions according to the consumer project's conventions.
The library's convention of one public type per file is not a requirement
for consumer code.

## Shared types

Use the installed version's public API. Common equivalents include:

| Required contract | Shared type |
| --- | --- |
| `T` or `undefined` | `Ulx<T>` |
| `T` or `null` | `Nlx<T>` |
| `T`, `null` or `undefined` | `Nil<T>` |
| `T` or `void` | `Vdx<T>` |
| String-keyed record of `T` values | `Rec<T>` |
| General callable or async callable | `AnyFn<Args, Result>`, `AsyncFn<Args, Result>` |
| Callback returning `void` or `Promise<void>` | `Noop`, `AsyncNoop`, `AsyncTap<T>` as appropriate |
| Identity-shaped callback | `Tap<T>` |
| Nested optional properties | `DeepPartial<T>` |
| Optional or required selected properties | `PickPartial<T, Keys>`, `PickRequired<T, Keys>` |
| Awaited return of an async function | `AsyncReturnType<Fn>` |

Use other exported helpers only after checking their precise definitions.
Optional properties (`value?: T`) remain optional properties; these aliases do
not require replacing property syntax or introducing additional nullability.
A standalone `void` return does not need a `Vdx` wrapper.

## Runtime guards

Replace equivalent direct checks with the corresponding method:

| Direct check | Equivalent guard |
| --- | --- |
| `value === undefined` | `guard.ulx(value)` |
| `value === null` | `guard.nlx(value)` |
| Either null or undefined | `guard.nil(value)` |
| Neither null nor undefined | `guard.not.nil(value)` |
| `typeof value === 'string'` | `guard.string(value)` |
| `typeof value === 'boolean'` | `guard.boolean(value)` |
| `typeof value === 'function'` | `guard.function(value)` |
| `value === true` / `value === false` | `guard.true(value)` / `guard.false(value)` |
| Global `Array.isArray(value)` | `guard.array(value)` |

Use negation for equivalent negative checks. Preserve evaluation count, side
effects and type narrowing when replacing an expression. A generic collection
guard establishes its container kind, not its element types: `guard.array<User>`
does not validate a `User[]` received from an untrusted source.

`guard.number` accepts only finite numbers, so it is not equivalent to every
`typeof value === 'number'` check. `guard.record` excludes null and arrays, so
it is not equivalent to `typeof value === 'object'`. Filled strings, positive
safe integers, URLs and collection checks MUST use the method matching the
actual contract; a broader or narrower check is not a valid substitution.

Keep defensive `typeof` checks for potentially undeclared globals: passing an
undeclared name to a function can throw. Keep domain-specific comparisons,
checks using deliberately shadowed globals, and checks with no equivalent
method. Do not introduce a circular dependency to reuse a guard.

## Applicability

Projects explicitly adopting `@gost-kit/common` as their shared types and guards
library, including TypeScript in framework components. Apply to new
or modified code; an unrelated change does not require migrating the entire
codebase. Generated and third-party code are excluded. Guard implementation
and tests verifying primitive checks may use those checks directly. Helper
definitions may use the primitives they encapsulate. Inside `@gost-kit/common`,
reuse helpers through relative imports instead of importing the package itself.

`@gost-kit/common` is the package name in the reviewed release-preparation
revision of the separate gost-kit repository. Consumers MUST verify the selected
artifact's name, version and public exports before adopting it. An available
registry release is not assumed; configure a local or packaged dependency when
needed. This draft does not promise a registry release.
No ESLint integration or automatic migration is supplied by this standard.

## Rationale

A shared vocabulary avoids divergent helper definitions and makes equivalent
runtime checks recognizable across projects. Equivalence is necessary to retain
behavior and type precision. A guard does not replace validation of a complete
external contract; TS-TYPES-001 still requires boundary validation.

## Verification

Review new and modified type definitions, imports and runtime checks against the
installed library's API. Confirm that aliases and guards preserve nullability,
optional properties, callback results and runtime acceptance. Type-check the
consumer and run relevant behavior tests. Review legitimate exceptions rather
than blindly replacing syntax. Inspect imports for private paths and duplicate
value/type declarations from the same module. These checks are manual policy
review in addition to compiler/tests; no automatic enforcement is claimed.

## References

- [gost-kit](https://github.com/antonsmolko/gost-kit) is the library's source repository.
- [Validate external values](runtime-boundaries.md) specifies complete boundary validation.
