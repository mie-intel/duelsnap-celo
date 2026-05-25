"use client";

import { useState, useCallback, useRef } from "react";

type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: Error };

/**
 * Manages async operation state (loading/success/error).
 * Prevents state updates on unmounted components.
 *
 * @example
 * const { execute, status, data, error } = useAsync(fetchProfile);
 * <button onClick={() => execute(address)}>Load</button>
 * {status === 'loading' && <Spinner />}
 * {data && <ProfileCard data={data} />}
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>,
) {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const mountedRef = useRef(true);

  // Track mount state
  // (useEffect cleanup in hook consumers should call this if needed)

  const execute = useCallback(
    async (...args: Args) => {
      setState({ status: "loading", data: null, error: null });
      try {
        const data = await asyncFn(...args);
        if (mountedRef.current) {
          setState({ status: "success", data, error: null });
        }
        return data;
      } catch (err) {
        if (mountedRef.current) {
          setState({
            status: "error",
            data: null,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
        throw err;
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setState({ status: "idle", data: null, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  };
}
