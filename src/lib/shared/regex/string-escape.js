
/**
 * Simple function to escape strings
 */

const escapes = {
    '\\': '\\\\',
    '^': '\\^',
    '$': '\\$',
    '.': '\\.',
    '*': '\\*',
    '+': '\\+',
    '?': '\\?',
    '(': '\\(',
    ')': '\\)',
    '[': '\\[',
    ']': '\\]',
    '{': '\\{',
    '}': '\\}',
    '|': '\\|'
  };
  
  const unescapedRe = /[\\^$.*+?()[\]{}|]/g;
  

  const escape = ( str ) => {
    if ( str.length === 1 ) return escapes[str] || str;
    return str.replace ( unescapedRe, char => `\\${char}` );
  };
  

  
  export default escape;