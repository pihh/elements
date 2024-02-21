export const initSubscriptions = function (clone) {
  for (let key of ["__propSubscriptions__"]) {
    if (!clone.hasOwnProperty(key)) {
      clone[key] = {};
    }
  }
  clone.__propSubscribe__ = (prop, callback) => {
    if (!clone.__propSubscriptions__.hasOwnProperty(prop)) {
      clone.__propSubscriptions__[prop] = [];
    }
    clone.__propSubscriptions__[prop].push(callback);
  };
  clone.__initialSubscriptionCallback = function(){
    Object.keys(clone.__propSubscriptions__).forEach(key => {
        clone.__propSubscriptions__[key].map(callback => callback());
    })
  }
};
