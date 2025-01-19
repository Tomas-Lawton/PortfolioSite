import React, { useEffect, useState } from "react";

const CustomAlert = ({ handleContactScroll }) => {

  // const [showAlert, setAlert] = useState(false)


  const handleClickAlert = () => {
    handleContactScroll();
    // setAlert(false)

  }

  // useEffect(() => {
  //   setAlert(true);
  //   window.addEventListener('scroll', () => setAlert(false));

  //   return () => window.addEventListener('scroll', () => setAlert(false));
  // }, []);

  return (
    // showAlert &&
    <div 
    onClick={handleClickAlert} 
    className={`transition-all duration-300 ease-out hover:scale-105 text-center `}>

    {/* className={`transition-all duration-300 ease-out hover:scale-105 text-center py-4 lg:px-4 w-100 z-50 absolute left-2/4 -translate-x-2/4	`}> */}
      <div className="p-3 bg-zinc-100 dark-mode cta items-center text-indigo-100 leading-none rounded-full flex lg:inline-flex" role="alert">
        <span className="flex rounded-full bg-accent text-center uppercase p-3 py-1 text-xs font-bold mr-3">Open to work</span>
        <span className="font mr-2 text-left flex-auto text-slate-600">Click Here</span>
        <svg className="fill-current opacity-75 h-4 w-4 text-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
      </div>
    </div>
  )
}

export default CustomAlert;