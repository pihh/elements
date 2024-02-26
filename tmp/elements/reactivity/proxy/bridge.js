import { ProxyMembrane } from "./membrane";

/**
 * Proxy bridge implementation
 * Used to track and notify scopes with different names but same pointers 
 * 
 * @deprecated
 * @param {*} scope 
 * @param {*} transport 
 * @returns 
 */
export const ProxyBridge = function (scope, transport = {}) {

    const bridge = new ProxyMembrane(
      {},
      {
        get(target, path) {
          if (transport.hasOwnProperty(path[0])) {
            console.log("will return self");
            return transport[path[0]].value;
          }
          return scope[path[0]];
        },
        set(target, path, value) {
          scope[path] = value;
          console.log("Will set path", target, path);
          if (transport.hasOwnProperty(path[0])) {
            console.log("will return self", path);
            // return transport[path[0]]
          }
          return true;
        },
      }
    );
  
    return bridge;
  };
  
  /*
  const bridge = ProxyBridge(scope,{
      l: scope.list[0],
      ol:scope.object.objectList[0]
  });
  */