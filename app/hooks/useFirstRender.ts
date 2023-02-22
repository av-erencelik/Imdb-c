import { useEffect, useRef } from "react";

export default function useFirstRender() {
  const ref = useRef(true);
  useEffect(() => {
    if (ref.current) {
      ref.current = false;
    }
  }, [ref]);
  return ref.current;
}
