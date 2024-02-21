
import compile from './compile';


/* MAIN */

const render = ( template, context={}, options={} ) => {

  return compile ( template, options )( context );

};

/* EXPORT */

export default render;