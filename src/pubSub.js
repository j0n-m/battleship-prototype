/**
 *
 * pubSub.subscribe() = on(), add(), listen()
 * pubSub.unsubscribe() = off(), remove(), unlisten()
 * pubSub.publish() = emit(), announce()
 *
 */

const pubSub = {
  events: {},
  subscribe: function sub(eventName, cb) {
    this.events[eventName] = this.events[eventName] || []; // checks if property name exists (cannot assign values if doesn't exist)
    this.events[eventName].push(cb);
  },
  unsubscribe: function unsub(eventName, cb) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((func) => func !== cb);
    }
  },
  publish: function publish(eventName, dataParamaters) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => {
        cb(dataParamaters);
      });
    }
  },
};

export default pubSub;
