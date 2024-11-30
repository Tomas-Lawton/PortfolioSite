// import gsap, { Power3 } from "gsap";
import ScrambleText from 'scramble-text';

// export const scramble = (element) => {
//   console.log(element)
//   if (element) {
//     const resultText = element.textContent
//     new ScrambleText( element, {
// 		// timeOffset : 50,
// 		callback: function () { console.log(resultText); }
// 	} ).start();

//   // scrambleInstance.start();

//     // setTimeout(() => {
//     //   scrambleInstance.stop();
//     // }, 2000); // 2000 ms = 2 seconds
//   }
// };


export const scramble = (element) => {
  if (element && !element.hasAttribute('data-scrambled')) {  // Check if the element is already scrambled
    console.log(element);
    const resultText = element.textContent;

    const scrambleInstance = new ScrambleText(element, {
      // chars: [
      //   'W','h','e','r','e',
      //   'C','h','a','o','s',
      //   'M','e','e','t','s',
      //   'C','o','d','e','',
      //   '安','以','宇','衣','於',
      //   '加','幾','久','計','己',
      //   '左','之','寸','世','曽',
      //   '太','知','川','天','止',
      // ],
      callback: function () {
        console.log(resultText);  // Log the original text after scrambling
      },
    });

    scrambleInstance.start();

    // Stop the scramble effect after 2 seconds and mark the element as scrambled
    element.setAttribute('data-scrambled', 'true');  // Mark element as scrambled
    setTimeout(() => {
      scrambleInstance.stop();
    }, 2000);  // 2000 ms = 2 seconds
  }
};




export const stagger = (target, fromvVars, toVars) => {
  return gsap.fromTo(
    target,
    { opacity: 0, ...fromvVars },
    { opacity: 1, ...toVars, stagger: 0.2, ease: Power3.easeOut }
  );
};



export const slide = (target, fromvVars, toVars) => {
  return gsap.fromTo(
    target,
    { left: -200, ...fromvVars },
    { left: 0, ...toVars, stagger: 0.2, ease: Power3.easeOut }
  );
};