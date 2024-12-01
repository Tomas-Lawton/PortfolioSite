import gsap, { Power3 } from "gsap";
// import ScrambleText from 'scramble-text';

// export const scramble = async (element) => {
//   if (element && !element.hasAttribute('data-scrambled')) {  // Check if the element is already scrambled
//     const scrambleInstance = new ScrambleText(element).start();
//     element.setAttribute('data-scrambled', 'true');  // Mark element as scrambled
//     setTimeout(() => {
//       scrambleInstance.stop();
//     }, 2000); 
//   }
// };

// export const scramble = (element) => {
//   if (element && !element.hasAttribute("data-scrambled")) {
//     console.log("Starting scramble for:", element);

//     // Initialize ScrambleText and start effect
//     const scrambleInstance = new ScrambleText(element)
//     // .start();
//     element.setAttribute("data-scrambled", "true"); // Prevent duplicate scrambling

//     // Stop scrambling after 2 seconds
//     // setTimeout(() => {
//     //   console.log("Stopping scramble for:", element);
//     //   scrambleInstance.stop();
//     //   element.removeAttribute("data-scrambled"); // Allow re-scrambling
//     // }, 5000);
//   } else {
//     console.warn("Element already scrambled or invalid:", element);
//   }
// };


export const stagger = (target, fromvVars, toVars, callback) => {
  gsap.fromTo(
    target,
    { opacity: 0, ...fromvVars },
    { opacity: 1, ...toVars, stagger: 0.4, ease: Power3.easeOut, onComplete: callback }
  );
};


export const slide = (target, fromvVars, toVars) => {
  return gsap.fromTo(
    target,
    { left: -200, ...fromvVars },
    { left: 0, ...toVars, stagger: 0.2, ease: Power3.easeOut }
  );
};