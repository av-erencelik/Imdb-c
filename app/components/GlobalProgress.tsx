import * as React from "react";
import { useTransition } from "@remix-run/react";

function GlobalLoading() {
  const transition = useTransition();
  const active = transition.state !== "idle";

  const ref = React.useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = React.useState(true);

  React.useEffect(() => {
    if (!ref.current) return;
    if (active) setAnimationComplete(false);

    Promise.allSettled(ref.current.getAnimations().map(({ finished }) => finished)).then(
      () => !active && setAnimationComplete(true)
    );
  }, [active]);

  return (
    <div role="progressbar" aria-hidden={!active} aria-valuetext={active ? "Loading" : undefined} className="progress">
      <div
        ref={ref}
        className={`bar submit
          ${transition.state === "idle" && animationComplete && "idle"}
          ${transition.state === "loading" && "load"},
          ${transition.state === "idle" && !animationComplete && "finish"}
        )`}
      />
    </div>
  );
}

export { GlobalLoading };
