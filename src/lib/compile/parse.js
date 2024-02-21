
/* IMPORT */

import {parse} from 'grammex';
import {makeGrammar} from './grammar';


/* MAIN */

const _parse = ( template, options ) => {

  return parse ( template, makeGrammar ( options ), { memoization: false } )[0];

};

/* EXPORT */

export default _parse;