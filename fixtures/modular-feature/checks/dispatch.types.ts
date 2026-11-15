// Compile-only public dispatch contract; no widening or manual path registry.
import type { Dispatch, DispatchAction, ScopedActions } from '@gost-kit/common';
import type { RootAction } from '../src/store/contracts.ts';
const check = (dispatch: Dispatch<RootAction>) => {
  void dispatch('directory/QueryChangedAction', { query: 'Ada' });
  void dispatch({ action: 'registration/NameChangedAction', payload: { name: 'Ada' } });
  void dispatch('directory/LoadAction');
  // @ts-expect-error required payload is missing
  void dispatch('directory/QueryChangedAction');
  // @ts-expect-error wrong payload for this namespace/action
  void dispatch('directory/QueryChangedAction', { name: 'Ada' });
  // @ts-expect-error namespace and action are correlated
  void dispatch('directory/CreatedAction', { user: { id: '1', name: 'Ada' } });
  // @ts-expect-error old flattened dispatch is not accepted
  void dispatch({ scope: 'directory', type: 'LoadAction' });
  // @ts-expect-error object form also requires the declared payload
  void dispatch({ action: 'registration/NameChangedAction' });
};
type Extra = ScopedActions<{ root:
  | { type: 'CountAction'; payload: number }
  | { type: 'RowsAction'; payload: string[] }
  | { type: 'OptionsAction'; payload: { query?: string } }
}>;
const payloadForms = (dispatch: Dispatch<Extra>) => {
  void dispatch('root/CountAction', 3);
  void dispatch({ action: 'root/RowsAction', payload: ['one'] });
  void dispatch('root/OptionsAction');
  void dispatch({ action: 'root/OptionsAction' });
  // @ts-expect-error root namespace must be explicit
  void dispatch('CountAction', 3);
  // @ts-expect-error primitive payload must retain its type
  void dispatch('root/CountAction', 'three');
  // @ts-expect-error array payload cannot be replaced by an object
  const invalid: DispatchAction<Extra> = { action: 'root/RowsAction', payload: {} };
  void invalid;
};
void check; void payloadForms;
