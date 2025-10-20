import gsap, { Power3 } from "gsap";
export const stagger = (target, fromvVars, toVars, callback) => {
  gsap.fromTo(
    target,
    { opacity: 0, ...fromvVars },
    {
      opacity: 1,
      ...toVars,
      stagger: 0.4,
      ease: Power3.easeOut,
      onComplete: callback,
    }
  );
};

export const slide = (target, fromvVars, toVars) => {
  return gsap.fromTo(
    target,
    { left: -200, ...fromvVars },
    { left: 0, ...toVars, stagger: 0.2, ease: Power3.easeOut }
  );
};
