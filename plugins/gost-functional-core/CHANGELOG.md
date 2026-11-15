# Changelog

Entries describe versioned content. Publication requires an existing approved
immutable tag selecting a snapshot with this plugin and version.

## 0.3.0 (unreleased)

- Use published common 0.4.0 typed dispatch paths and payload actions; update API callbacks and verified reducer/dispatch examples.

## 0.2.1

- Clarify release availability and checked snapshot selection in README.
- Use an explicitly selected existing approved tag for installation/update;
  preserve skill behavior and public recipes.

## 0.2.0

- Update the API recipe to published common 0.3.0: mapped API operations,
  createApiEffect and the application-level createApiEffector.
- Check distinct response/action types, async mapping and failure boundaries
  against the real npm artifact.
- Verify reducer examples and API success/error/defaultError flow with real
  public artifacts; keep pure reducer tests separate from effect execution.

- Add the framework-independent functional-core feature development skill and
  public API recipe as a separate plugin in the GOST marketplace.
- Keep feature state/actions/reducers/tests separate from existing application
  effects and effectors; callbacks return result actions for app-level dispatch.
- Show reducer unit cases using existing state factories and scenario overrides,
  separately from dispatch/effect integration checks.
