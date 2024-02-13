export class PropMap {
    map = {};
    constructor() {}
    track(prop, configuration = {}) {
      if (!this.map.hasOwnProperty(prop)) {
        this.map[prop] = [];
      }
      delete configuration.setup;
      this.map[prop].push({
        node: configuration.node,
        type: configuration.type,
        value: configuration.value,
        query: configuration.query,
        connected: false,
        subscriptions: [],
        connect: function (instance) {},
        setup: function (instance) {
          if (this.connected) return this.subscriptions;
          this.subscriptions = this.connect(instance) || [];
          this.connected = true;
        },
        ...configuration,
      });
    }
  }
