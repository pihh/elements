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

/*
export const pathName = (path = []) => {
    if (Array.isArray(path)) {
      path = path.map(el => el.replaceAll('[','').replaceAll(']','').trim()).filter(el => el.length > 0).join(".");
    }
  
    path = path
      .replaceAll("[", ".")
      .replaceAll("]", ".")
      .replaceAll("..", ".")
      .trim();
    if (path.endsWith(".")) {
      path = path.slice(0, -1);
    }
    return path;
  };
*/