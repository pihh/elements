import { Drivers, Storage } from "@ionic/storage";

class WebComponentRegistry {
  constructor() {
    this.resolved;
    this.instance = new Promise((res)=>{
        this.resolved = res;
    });
    this.init();
  }

  async init() {
    let storage = new Storage({
      name: "__pihhWebComponents",
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    });
    storage = await storage.create();
    this.__storage = storage;
    for (let item of this.__initStack) {
      await this.set(item.key, item.value);
    }
    this.__initStack = [];
    this.resolved();
  }

  __initStack = [];

  async set(key, value) {
    if (this.__storage) {
      await this.__storage.set(key, value);
    } else {
      this.__initStack.push({ key, value });
    }
  }

  async get(key) {
    return this.instance.then(async ()=> {
        return await this.__storage.get(key);

    });
  }
}
export const Registry = new WebComponentRegistry();
