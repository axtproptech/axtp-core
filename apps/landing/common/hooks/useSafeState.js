import { useEffect, useRef, useState } from "react";

export function useSafeState(initialValue) {
  const isMounted = useRef(false);

  const [state, setState] = useState(initialValue);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function safeSetState(s) {
    if (isMounted.current) {
      setState(s);
    } else {
      console.warn("Attempted to set state for unmounted component");
    }
  }

  return [state, safeSetState, isMounted];
}
