# Changelog

## 0.1.0 (unreleased)

- Add the framework-independent functional-core feature development skill and
  public API recipe as a separate plugin in the GOST marketplace.
- Keep feature state/actions/reducers/tests separate from existing application
  effects and effectors; receivers return result actions for app-level dispatch.
- Show reducer unit cases using existing state factories and scenario overrides,
  separately from dispatch/effect integration checks.
