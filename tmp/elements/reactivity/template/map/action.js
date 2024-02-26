export class ActionMap {
    map = {};
    constructor() {}
    track(prop, configuration = {}) {
      if (!this.map.hasOwnProperty(prop)) {
        this.map[prop] = [];
      }
      delete configuration.setup;
      this.map[prop].push({
        node: configuration.node,
        eventName: configuration.eventName,
        value: configuration.value,
        functionName: configuration.query,
        argumentList: [],
        connected: false,
        subscriptions: [],
        connect: function (instance) {
            /**
             * We define the connection callback here 
             * @todo
             */
        },
        setup: function (instance) {
          
          if (this.connected) return;
          this.connected = true;
          this.connect(instance);
          // this.subscriptions = this.connect(instance) || [];
        },
        ...configuration,
      });
    }
  }