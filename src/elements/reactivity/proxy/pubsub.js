import { pathName } from "../../helpers/path";

/**
 * Reactivity pubsub 
 * Used to track and subscribe to changes in the scope  
 */

export class PubSub {
    constructor() {}
  
    events = {};
    prevValues = {};
    subscribe(event, callback) {
      event = pathName(event);
      if (!this.events[event]) {
        this.events[event] = [];
        this.prevValues[event] = undefined;
      }
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
    /**
     * Notifies all the subscribers of a data change
     * @param {String} event 
     * @param {String|Number|Boolean} data 
     */
    publish(event, data) {
      console.log(event);
      if (this.events[event]) {
        // if (this.prevValues[event] != data) {
        //   this.prevValues[event] = data;
          this.events[event].forEach((callback) => callback(data));
        // } else {
        //   console.log("data didnt change:", event);
        // }
      } else {
        console.log("no events subscribed yet:", event);
      }
    }
    /**
     * @todo
     * @param {*} subscription 
     */
    unsubscribe(subscription) {
        console.log('@TODO unsubscribe')
    }
  
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