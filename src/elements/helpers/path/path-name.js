/**
 * Gets the pathName of the scope variable and rewrites it into a Pubsub readable format
 * 
 * Example: 
 *  this.scope.items[0].card.title 
 *         => 
 * items.0.card.title
 * @param {Array | string } path 
 * @returns string 
 */

export const pathName = function(path){
  if(!Array.isArray(path)){
    path = path.replaceAll('[','.');
    path = path.split('.').map(el => el.replaceAll(']','').replaceAll('.','').trim());
  }
  path = path.join('.')
  return path
}

