# Prepare typed dispatch skill release

## Why

[#109](https://github.com/antonsmolko/gost-spec/issues/109) delivered typed dispatch
compatibility in main 3a4ec55; existing tags still select the older APIs.
[#112](https://github.com/antonsmolko/gost-spec/issues/112) prepares the three
updated plugins for installation in asc-admin after separate release approval.

## What Changes

Reuse FC 0.3.0, shell 0.4.0 and feature 0.2.0 candidates. Normalize their changelog
headings to the existing publication-neutral condition; keep recipes, manifests,
fixtures, presenter, catalogs and npm versions intact. Update release guidance
and checkpoints; verify public native candidate delivery in both hosts.

## Capabilities

No new behavior contract; skip_specs=true. Existing marketplace/version/approval
contracts apply. Archive/sync PR #113 is an independent prerequisite outcome.

## Impact

Three changelog headings, runbook, queue/handoff and this release evidence.
No new installer, runtime migration, normative content acceptance or publication.
