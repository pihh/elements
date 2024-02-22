export function getClone(element,out){
    let clone = element.querySelector(out.dataset.selector);
    return clone;
}
export function setupCleanup(element,clone,out){
    delete clone.dataset[out.dataset.path];
}