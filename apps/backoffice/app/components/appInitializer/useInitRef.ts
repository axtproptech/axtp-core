import { useRef } from "react";

export function useInitRef() {
  const initRef = useRef(false);

  function setInitialized() {
    initRef.current = true;
  }

  function isInitialized() {
    return initRef.current;
  }

  return {
    setInitialized,
    isInitialized,
  };
}
