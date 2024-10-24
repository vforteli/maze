import { RefObject, useLayoutEffect, useRef } from "react";
import { MoveDirection } from "../boardUtils";
import { animateMany, ChainablePath } from "../../utils";

const animationOptions: KeyframeAnimationOptions = {
  duration: 500,
  easing: "ease-in-out",
  composite: "replace",
  fill: "forwards",
};

export type MovableTileProps = {
  shift: boolean;
  move: boolean;
  direction: MoveDirection | undefined;
  targetRef?: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  onAnimationEnd: () => void;
};

export const MovableTile = ({ shift, move, targetRef, children, direction, onAnimationEnd }: MovableTileProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current !== null) {
      if (shift) {
        const currentRect = ref.current.getBoundingClientRect();

        // figure out how much the tiles should be moved, the magical number 3 is the grid gap...
        const h_shift = currentRect.width + 2;
        const v_shift = currentRect.height + 2;

        const dx_shift = direction === "right" ? h_shift : direction === "left" ? -h_shift : 0;
        const dy_shift = direction === "down" ? v_shift : direction === "up" ? -v_shift : 0;

        const targetRect = targetRef?.current?.getBoundingClientRect();
        const dx_playertile = targetRect ? targetRect.x - currentRect.x : 0;
        const dy_playertile = targetRect ? targetRect.y - currentRect.y : 0;

        const shiftPath: ChainablePath = { options: animationOptions, path: `path("M0,0 L${dx_shift},${dy_shift}")` };
        const movePath: ChainablePath = { options: animationOptions, path: `path("M${dx_shift},${dy_shift} L${dx_playertile},${dy_playertile}")` };

        move ? animateMany(ref.current, [shiftPath, movePath]).then(onAnimationEnd) : animateMany(ref.current, [shiftPath]);
      } else {
        ref.current.style.offsetPath = "";
      }
    }
  }, [targetRef, ref, shift, move, onAnimationEnd, direction]);

  return (
    <div className="movable-tile" ref={ref}>
      {children}
    </div>
  );
};
