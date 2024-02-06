const setupActions = {
    __subscribe: function (subscription, scope, connection, callback) {

      if(subscription.indexOf('__') == 0) return;
      
      const sub = connection(subscription, callback);
      this.__subscription !== sub.event;
      
      if(this.__subscriptions.map(s => s.subscription).indexOf(subscription) >-1) return
      this.__subscriptions.push({
        unsubscribe: sub.unsubscribe,
        subscription,
        scope,
        connection,
      });
      this.__subscriptions.push({
        unsubscribe: sub.unsubscribe,
        subscription: sub.event,
        scope,
        connection,
      })
      callback();
    },
    __unsubscribe: function () {
      this.__subscriptions.map((_s) => _s.unsubscribe());
      this.__subscriptions = [];
    },
  };
  
  export const setupElement = function (element) {
    if (element.__didSetup) return element;
    if(!element.controller) element.controller = element;
    
    for (let key of ["__subscriptions", "__events","__didInitialize"]) {
      if (!element.hasOwnProperty(key)) {
        element[key] = [];
      }
    }
    for (let key of ["__actions"]) {
      if (!element.hasOwnProperty(key)) {
        element[key] = {};
      }
    }
    for (let key of ["__subscribe", "__unsubscribe"]) {
      if (!element.hasOwnProperty(key)) {
        element[key] = setupActions[key];
      }
    }
    element.__didSetup = true;
    return element;
  };
  