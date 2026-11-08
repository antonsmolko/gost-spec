# Changelog

## 0.1.1 (unreleased)

- Correct the API recipe to published common 0.2.1: typed method/body,
  onSuccess/onError and the application-level createApiHandler.
- Verify reducer examples and API success/error/defaultError flow with real
  public artifacts; keep pure reducer tests separate from effect execution.

- Add the framework-independent functional-core feature development skill and
  public API recipe as a separate plugin in the GOST marketplace.
- Keep feature state/actions/reducers/tests separate from existing application
  effects and effectors; receivers return result actions for app-level dispatch.
- Show reducer unit cases using existing state factories and scenario overrides,
  separately from dispatch/effect integration checks.
