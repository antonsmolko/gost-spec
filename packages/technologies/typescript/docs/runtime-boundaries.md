# Validate external values

ID: TS-TYPES-001.

Status: proposed (draft; not approved). Level: required.

## Requirement

Values crossing an untrusted boundary MUST be treated as unknown until runtime
checks establish the application contract. Network responses, persisted data,
user input and inter-process messages MUST be checked for the properties and
constraints the consumer relies on before they enter trusted application state.
Invalid values MUST produce a handled failure rather than masquerading as a
valid domain value. A type assertion alone MUST NOT be used as validation.

## Rationale

Static types cannot establish the runtime shape of external data. A declaration
or cast may make the compiler accept a value without making that value safe.

## Applicability

TypeScript programs consuming data outside their trusted runtime boundary.
Validation may use a schema, decoder or tested type guard; no particular library
or named guard API is required by this validation requirement.
[TS-COMMON-001](common-types-and-guards.md) separately proposes common helper
and guard usage when their semantics match; it does not weaken validation.
Data already checked at a documented boundary need not be parsed again at every
internal call. Validate only constraints used by the application, not unrelated
transport metadata.

## Verification

Review boundary adapters and paths into trusted state. Tests MUST cover valid
data and violations of the relied-on contract, including missing fields, wrong
primitive types and relevant value constraints. Confirm invalid input follows a
handled failure path. Compiler success alone is not runtime validation.

## References

[TypeScript type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
explain the distinction between compile-time assertions and runtime checking.
The required validation policy above is this profile's proposal.
