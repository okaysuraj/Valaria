/** Load one query at a time and cancel stale requests on key changes or unmount. */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Each query owns its abort controller. Stale responses never replace current state. */
export function useRequest<T>(
  key: string,
  loader: (signal: AbortSignal) => Promise<T>,
  enabled = true,
) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{
    key: string;
    data: T | null;
    error: string | null;
    loading: boolean;
  }>({ key, data: null, error: null, loading: enabled });
  useEffect(() => {
    const controller = new AbortController();
    if (!enabled) {
      setState({ key, data: null, error: null, loading: false });
      return;
    }
    setState({ key, data: null, error: null, loading: true });
    loaderRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ key, data, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            key,
            data: null,
            error: error instanceof Error ? error.message : 'Unable to connect. Please retry.',
            loading: false,
          });
      });
    return () => controller.abort();
  }, [key, revision, enabled]);
  const reload = useCallback(() => setRevision((current) => current + 1), []);
  return {
    ...(state.key === key && enabled ? state : { data: null, error: null, loading: enabled }),
    reload,
  };
}
