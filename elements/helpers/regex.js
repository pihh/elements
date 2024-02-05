export function getStrBetween(str, start='{{', end ='}}') {
    let matches = [];
    try {
      matches = str
        .split(start)
        .slice(1)
        .map((el) => el.split(end)[0])//.trim());
    } catch (e) {}
  
    return matches || [];
  }

  export const initialExpressionCleanup = function(element){
    // INITIAL CLEANUP
    
    let innerHTML = element.innerHTML;
    let matches = getStrBetween(innerHTML);
    for(let match of matches){
        const original = '{{'+match+'}}';
        const replacement = '{{'+match.replaceAll(' ','')+'}}';
        innerHTML = innerHTML.replaceAll(original, replacement);
    } 
    element.innerHTML = innerHTML;

    return element
  }

  export function isChar(c){
    return c.toUpperCase() != c.toLowerCase();
  }

  export function getIndexes(str, match="{{", idxs=[]){
    let index = str.indexOf(match);
    let tmp = str;
    if(index > -1){
      idxs.push(index);
      tmp = tmp.split('');
      tmp[index] = '*';
      tmp[index+1] = '*';
      tmp = tmp.join('');
      // tmp[index+1] = '*';
      return getIndexes(tmp, match, idxs)
    }
  
    return idxs;
  }