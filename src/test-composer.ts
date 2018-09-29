const generateRunner = (fn:string, tests:string) => {  
  return `
    const run = () => { 
      ${fn}
      
      ${tests}
    };

    run();
    //last line is returned by the vm
    logs;
  `;
}

export {
  generateRunner
}
