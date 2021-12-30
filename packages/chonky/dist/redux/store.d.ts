import { RootState } from '../types/redux.types';
export declare const useChonkyStore: (chonkyInstanceId: string) => import("@reduxjs/toolkit").EnhancedStore<RootState, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<import("redux-thunk").ThunkMiddleware<RootState, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<RootState, import("redux").AnyAction, undefined> | import("redux").Middleware<{}, RootState, import("redux").Dispatch<import("redux").AnyAction>>>>;
/**
 * Hook that can be used with parametrized selectors.
 */
export declare const useParamSelector: <Args extends any[], Value>(parametrizedSelector: (...args: Args) => (state: RootState) => Value, ...selectorParams: Args) => Value;
/**
 * DTE - DispatchThunkEffect. This method is used to decrease code duplication in
 * main Chonky method.
 */
export declare const useDTE: <Args extends any[]>(actionCreator: (...args: Args) => any, ...selectorParams: Args) => void;
export declare const usePropReduxUpdate: <Payload extends unknown>(actionCreator: (payload: Payload) => any, payload: Payload) => void;
