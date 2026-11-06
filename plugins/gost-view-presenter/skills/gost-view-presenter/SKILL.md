---
name: gost-view-presenter
description: Use when a component contains formatting, display conditions or list transformations that need extraction or changes, or when creating and testing pure presentation functions.
---

# Prepare view data

Move view-data calculations into pure functions. The component displays their
results; ordinary input/output tests check the calculations.

Read [the complete example](references/view-presenter.md) before editing. It
shows the original component, a typed presenter with named parameters, colocated
unit tests and reactive use of the result. Follow its source links for the
selected presentation guidance; record the revision and proposed status.

## Establish the expected view

Inspect the requested component, input/context types, existing presentation
functions, project conventions and checks. Identify the expected text, display
branches, list rows and documented nullable/loading/empty/error states.
Use the current source of data and existing event callbacks. Obtain missing
required context or behaviour before dependent edits; leave unavailable source
verification explicit in the result. A supplied verified copy of the linked
source is suitable when network access is unavailable.

## Extract and connect

Pass data and relevant context, such as locale or labels, explicitly. Keep
functions deterministic and preserve their inputs. Keep I/O and hidden reads of
stores, current time or mutable globals outside the calculation.

Name functions `<name>Presenter`. Use a named-parameter object and an explicit
view-result type, for
example `catalogPresenter({ input, labels }): ViewState`. A presenter prepares
its complete result directly; do not call another presenter from it. A component may call several independent presenters. Use ready fields, boolean conditions and
rows in markup. In Svelte 5, a reactive presenter call such as
`$derived(catalogPresenter({ input, labels }))` retains updates; a one-time snapshot
will not. Moving the calculation to a component helper or derived expression
alone does not extract its responsibility.

A component already receiving ready props needs no extra wrapper. Preserve the
project's dependencies, data bindings, state ownership and event behaviour.
If the task requires changing them, report that separate work. Handle the
input contract's variants; keep external-data validation at its existing boundary
and do not hide missing required data with assertions or guessed defaults.

## Verify and report

Colocate ordinary function tests using the project's runner. Cover outputs,
explicit context, documented variants, the complete view result and input preservation.
Separately check reactive changes in displayed text/branches/rows and existing
callbacks in the client runtime. Run applicable type/Svelte checks, build and
existing approved lint commands. Manually trace calculation sources and explain
policy-negative examples; compiler or lint success alone cannot prove purity.

Report changed files, actual checks, source revision and concrete limitations.
Repeat work should reuse the existing functions. Missing checks, sources or
required inputs stay visible as incomplete work. Keep new lint configuration
and state infrastructure outside this task.
