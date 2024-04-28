import { useEffect, useRef, useState } from "react";

/**
 * @param {string} name
 * @param {(() => any) | any} initialValue
 */
export function usePersistableSafeState(name, initialValue) {
  const isMounted = useRef(false);

  const [state, setState] = useState(initialValue);

  useEffect(() => {
    isMounted.current = true;

    const persistedState = localStorage.getItem(name);
    if (persistedState) {
      try {
        setState(JSON.parse(persistedState));
      } catch (e) {
        // no op
      }
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  function persistSetState(s) {
    if (isMounted.current) {
      setState(s);
      if (typeof s === "function") {
        setState((oldState) => {
          const obj = s(oldState);
          localStorage.setItem(name, JSON.stringify(obj));
          return obj;
        });
      } else {
        setState(s);
        localStorage.setItem(name, JSON.stringify(s));
      }
    } else {
      console.warn("Attempted to set state for unmounted component");
    }
  }

  function clearPersistedState() {
    localStorage.removeItem(name);
  }

  return [state, persistSetState, clearPersistedState, isMounted];
}
