import { PubSub } from "./pubsub";
import { pathName } from "../../helpers//path";
import { ProxyMembrane } from "./membrane";


/**
 * Reactive proxy membrane 
 * Tracks changes in scope and notifies subscribers 
 * @param {Object} scope -> reactive properties to be watched and their default values 
 * @returns [
 *  scope:Proxy, 
 *  connect:Function(key,callback), 
 *  render:Function, pubsub:Pubsub
 * ] 
 */
export const Reactive = function (scope) {
    const pubsub = new PubSub();
  
    scope = new ProxyMembrane(scope, {
      /*
       get(target, path) {
         console.log("here", ...arguments);
         return target[path];
       },
      */
      set(target, path, value, reciever) {
        try {
          let p = pathName(path);
          let type = typeof target[p];
  
          if (p.indexOf("__") == 0) {
            return true;
          }
  
          if (type !== "object" || Array.isArray(target[p])) {
            pubsub.publish(pathName(path), value);
          }
  
          return true;
          // pubsub.track();
        } catch (ex) {
          console.warn(ex);
          console.log(path, pathName(path), value);
        }
      },
      deleteProperty(target, path) {
        /**
         * @todo test this
         */
        delete pubsub.events[pathName(path)];
      },
    });
    const connect = function (path, event) {
      const subscription = pubsub.subscribe(pathName(path), event);
      return subscription;
    };
    const render = function () {
      for (let event of Object.keys(pubsub.events)) {
        pubsub.publish(event);
      }
    };
  
    return [scope, connect, render, pubsub];
  };
  