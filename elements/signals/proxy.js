export class ProxyMembrane {
  constructor(target, handler) {
    this._preproxy = new WeakMap();
    this._handler = handler;
    return this.proxify(target, []);
  }

  makeHandler(path) {
    let dp = this;
    return {
      get(target, key, receiver) {
        // console.log(target,key)
        // target = target[key];
        if (dp._handler.get) {
          //     // console.log('has get',target,key,path,target[key]);
          return dp._handler.get(target, [...path, key], receiver);
        }
        // console.log({target,key,path})
        return target[key];
      },
      set(target, key, value, receiver) {
        if (typeof value === "object") {
          value = dp.proxify(value, [...path, key]);
        }
        target[key] = value;

        if (dp._handler.set) {
          dp._handler.set(target, [...path, key], value, receiver);
        }
        return true;
      },

      deleteProperty(target, key) {
        if (Reflect.has(target, key)) {
          dp.unproxy(target, key);
          let deleted = Reflect.deleteProperty(target, key);
          if (deleted && dp._handler.deleteProperty) {
            dp._handler.deleteProperty(target, [...path, key]);
          }
          return deleted;
        }
        return false;
      },
    };
  }

  unproxy(obj, key) {
    if (this._preproxy.has(obj[key])) {
      // console.log('unproxy',key);
      obj[key] = this._preproxy.get(obj[key]);
      this._preproxy.delete(obj[key]);
    }

    for (let k of Object.keys(obj[key])) {
      if (typeof obj[key][k] === "object") {
        this.unproxy(obj[key], k);
      }
    }
  }

  proxify(obj, path) {
    for (let key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        obj[key] = this.proxify(obj[key], [...path, key]);
      }
    }
    let p = new Proxy(obj, this.makeHandler(path));
    this._preproxy.set(p, obj);
    return p;
  }
}

export const pathName = (path = []) => {
  if (Array.isArray(path)) {
    path = path.join(".");
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

export class PubSub {
  constructor() {}

  events = {};

  subscribe(event, callback) {
    event = pathName(event);
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);

    const subscription = () => {
      let subscribed = true;
      return {
        event: event,
        callback: callback,
        render: () => {
          if (subscribed) {
            if (this.events[event]) {
              for (let evt of this.events[event]) {
                evt();
              }
            }
          }
        },
        unsubscribe: () => {
          if (subscribed) {
            subscribed = false;
            if (this.events[event]) {
              this.events[event] = this.events[event].filter(
                (subscription) => subscription !== callback
              );
            }
          }
        },
      };
    };
    return subscription();
  }

  publish(event, data) {
    console.log("PUBLISH", event, data);
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    } else {
      console.log("no events subscribed yet:", event);
    }
  }
  unsubscribe(subscription) {}

  trackTimeout;
  track() {
    clearTimeout(this.trackTimeout);
    this.trackTimeout = setTimeout(() => {
      console.log("---------------------------");
      console.log("Subscription tracking".toUpperCase());
      console.log("---------------------------");
      let count = 0;
      for (let subscription of Object.keys(this.events)) {
        let sCount = this.events[subscription].length;
        console.log("Sub:", subscription, sCount);
        count += sCount;
      }

      console.log("");
      console.log("TOTAL: ", count + " active subscriptions");
      console.log("-------------------------------------");
    }, 100);
  }
}

export const Reactive = function (scope) {
  const pubsub = new PubSub();

  scope = new ProxyMembrane(scope, {
    // get(target, path) {
    //   console.log("here", ...arguments);
    //   return target[path];
    // },
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
      // console.log("delete", pubsub.events, pathName(path));
      // const name = pathName(path);
      // console.log(pathName(path),pubsub.events);
      // console.log('here')
      // let eventNames = Object.keys(pubsub.events);
      // eventNames.sort((a, b) => b.length - a.length);

      // for(let eventName of eventNames) {
      //   if(eventName.indexOf(name) == 0){

      //     delete pubsub.events[eventName];
      //   }
      // }
      delete pubsub.events[pathName(path)];

      // pubsub.track()
    },
    getPath(target, path) {
      console.log("getPath", path.split("."), target);
    },
  });
  const connect = function (path, event) {
    const subscription = pubsub.subscribe(pathName(path), event);
    // console.log('did connect', pathName,subscription);
    return subscription;
  };
  const render = function () {
    for (let event of Object.keys(pubsub.events)) {
      pubsub.publish(event);
    }
  };


  return [scope, connect, render, pubsub];
};

export const ProxyBridge = function (scope, transport = {}) {
  const _s = JSON.parse(JSON.stringify(scope));
  const bridge = new ProxyMembrane({}, {
    get(target, path) {
      if (transport.hasOwnProperty(path[0])) {
        console.log('will return self')
        return transport[path[0]].value
      }
      return scope[path[0]];
    },
    set(target,path,value){
      scope[path] = value
      console.log('Will set path',target,path)
      if (transport.hasOwnProperty(path[0])) {
        console.log('will return self' ,path)
        // return transport[path[0]]
      }
      return true
    }
  });

  return bridge;
};

/*
const bridge = ProxyBridge(scope,{
    l: scope.list[0],
    ol:scope.object.objectList[0]
});
*/
