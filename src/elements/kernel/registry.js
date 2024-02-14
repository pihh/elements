import { addGlobalStylesToShadowRoot } from "../compiler/styles/global-styles";

import {TemplateManager} from "../compiler/template/manager";

/**
 * Registry class is used to compile templates and it's dependencies in real time.
 * This way, the load time of the framework is reduced and it's a major flex :D
 *
 * @Singleton
 */
class _Registry {
  static instance;
  templates = {};
  files = {};
  components = {};
  prefix = "el-";

  constructor() {
    if (_Registry.instance) return _Registry.instance;
    _Registry.instance = this;
  }

  getName(path) {
    let name = path.replaceAll("../", "");
    return name;
  }

  /**
   * When a file is required, if wasn't loaded yet, load it , cache it and return it
   * Go to cache and return the required file/function
   */
  file(path) {}

  /**
   * When a component is initialized for the first time, store it's configurations
   * Go to cache and return the required file/function
   */
  componentSetup(component) {
    
    let name = component.constructor.name;
    console.log({name})
    let componentSetup = this.components[name];
    if (!componentSetup) {
      let setup = Object.assign({}, ElComponentSetup);
      let configuration = Object.assign({}, ElComponentConfiguration);
      configuration.selector = configuration.prefix + component.constructor.selector;
      
      let callback = function (self) {
        if(!self.__setup || !self.__setup.initialSetup){
          self.__props = {}
          self.__setup = setup;
          self.__config = configuration;
          self.__shadowRoot = self.attachShadow({
            mode: self.__config.shadowRoot,
          });
          if (self.__config.styles == "global") {
            console.log(self);
            addGlobalStylesToShadowRoot(self.__shadowRoot);
          }
          self.__setup.initialSetup = true;
        }

        return self
      };
      callback(component);
      this.components[name] = {
        setup,configuration,callback
      }
      
      // customElements.define(configuration.selector, component.constructor);
    }
    return this.components[name];
  }

  /**
   * When a template is required, if wasn't loaded/parsed yet, load it, map it,  cache it and return it
   * Go to cache and return the required template and it's functionality map
   *
   * @param {String} path
   * @return {Promise } HTMLTemplateElement
   */
  template(path,props=[]) {
    // Get template name and check for availability
    let name = this.getName(path);
    let template = this.templates[name];

    //
    if (template) return template;
    this.templates[name] = new Promise(async (res) => {
      const templateObject = new TemplateManager(name,props);
      const $template = templateObject.setup();

      res($template.__template.content.cloneNode(true).firstElementChild);
    });
    return this.templates[name];
  }
}

const ElComponentSetup = {
  didConnect:false,
  templateConnected: false,
  propertiesTracked: false,
  initialSetup: false,
};

const ElComponentConfiguration = {
  selector: "", // Required
  shadowRoot: "open", // "open, closed, none"
  styles: "global", // "global, contained",
  prefix: "el-",
};

export const Registry = new _Registry();
