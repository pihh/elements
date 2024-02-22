import { Template } from "../template";
import { TemplateRegistry } from "../registry";
import { ComponentConfigValidator } from "./config";

export const ComponentSetup = function (config = {}) {
  config = ComponentConfigValidator(config);
  const setup = {
    registered: false,
    template: "",
    selector: config.selector,
    styles: "",
    config,
    async load(instance) {
      if (!this.loaded) {
        this._template = await setup.template();
        console.log(this._template)
        // instance.container = await this.container(instance);
        this.BaseController = new Template(
          setup.selector,
          instance.props,
          this._template
        );
        this.loaded = true;
      }
      const Controller = this.BaseController.clone(
        instance.props,
        this.container
      );

      return Controller;
    },
    registerComponent(instance) {
      if (!this.registered) {
        customElements.define(setup.selector, instance);
        this.registered = true;
      }
      //   const Controller = new Template(setup.selector,instance.props,instance.template);

      // const props = {
      //     name: "world",
      //     description: "default value",
      //     textBinding: "text bindinf",
      //     counter: 1,
      //     item: "xxx",
      //     color: "red",
      //     counterUpdating: false,
      //     colors: ["white", "red", "blue"],
      //   };
      //   const selector = "[template=the-browser]";
      //   const template = document
      //     .querySelector(selector)
      //     .content.firstElementChild.firstElementChild.cloneNode(true);
      //   document.head.appendChild(template);
      //   const TheTemplate = new Template(selector, props, template);
    },
    container(instance) {
      let $container;
      if (config.shadow === "none") {
        $container = instance;
        // this.template.bindMethods(this.template,this)
      } else {
        $container = instance.attachShadow({ mode: config.shadow });
      }
      return $container;
    },
  };
  if (typeof config.template === "string") {
    setup.template = async function () {
      return config.template;
    };
  } else if (typeof config.template === "object") {
    if (config.template.hasOwnProperty("url")) {
      setup.template = async function () {
        let result = await fetch(config.template.url);
        let placeholder = document.createElement("template");
        document.head.appendChild(placeholder);
        result = await result.text();
        placeholder.innerHTML = result;
        console.log({ placeholder });
        return placeholder.content.firstElementChild.cloneNode(true);
      };
    } else if (config.template.hasOwnProperty("selector")) {
      setup.template = async function () {
        const tpl = document
          .querySelector(config.template.selector)
          .content.firstElementChild.firstElementChild.cloneNode(true);
        document.head.appendChild(tpl);
        return false;
      };
    }
  }

  return setup;
};
