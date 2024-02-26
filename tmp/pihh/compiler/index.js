import TemplateCompiler from "./template";
import { TheBaseComponent } from "../component";

import { State } from "../../elements/reactivity/state";

import { aggregation } from "./utils/aggregation";
import { extractClassInfo } from "./utils/extract-info";

export const Component = function (
  OriginalComponent,
  OriginalConfiguration = {}
) {
  // Steps for component compilation:

  // Get it's properties //
  let { methods, props, configuration } = extractClassInfo(
    OriginalComponent,
    OriginalConfiguration
  );
  let { input, output, connectors } = TemplateCompiler(
    configuration.template,
    Object.keys(props)
  );
  configuration.template = output;
  configuration.connectors = connectors;

  const compile = function () {
    class CompiledComponent extends aggregation(
      TheBaseComponent,
      OriginalComponent
    ) {
      static get observedAttributes() {
        return Object.keys(configuration.props);
      }
      constructor() {
        super();

        this.__init__();
      }

      connect() {
        console.log("Connecting", ...arguments);
      }

      connectedCallback() {
        super.connectedCallback();
        this.__setup__();
      }

      disconnectedCallback() {
        // super.disconnectedCallback();
        console.log("disconnected");
      }

      __connections__ = {};
      __subscriptions__ = [];
      __init__() {
        // Add shadow root
        if (this.shadowRoot) {
          this.__shadow__ = this.shadowRoot;
        } else {
          this.__shadow__ = this.attachShadow({ mode: "open" });
        }
        this.__shadow__.innerHTML = configuration.template;

        // Create reactivity
        const __scope__ = {};
        for (let prop of Object.keys(configuration.props)) {
          let propConfiguration = configuration.props[prop];
          __scope__[prop] = propConfiguration.defaultValue;
        }

        const { scope, connect, render } = State(__scope__);
        this.__scope__ = scope;
        this.connect = connect;
        // Parse this shit
        for (let prop of Object.keys(configuration.props)) {
          this.__defineGetter__(prop, function () {
            return this.__scope__[prop];
          });
          this.__defineSetter__(prop, function (value) {
            this.__scope__[prop] = value;
            return true;
          });
        }
      }

      __setup__() {
        if (!this.__setupComplete__) {
          if (!this.__setupOngoing__) {
            this.__setupOngoing__ = true;

            // Connect properties
            for (let prop of Object.keys(configuration.props)) {
              this[prop] = this.getAttribute(prop) || this[prop];
            }
            // debugger;
            // Connect reactivity
            let elements = [];
            elements = [
              ...this.__shadow__.querySelectorAll("[data-el-attribute]"),
            ];
            for (let element of elements) {
              const identifiers = element.dataset.elAttribute
                .split(",")
                .map((el) => el.trim());
              // console.log(identifiers, element, configuration.connectors);
              for (let identifier of identifiers) {
                configuration.connectors["data-el-attribute"][
                  identifier
                ].connect(this, element);
              }
              delete element.dataset.elAttribute;
            }

            elements = [...this.__shadow__.querySelectorAll("[data-el-text]")];
            for (let element of elements) {
              const identifiers = element.dataset.elText
                .split(",")
                .map((el) => el.trim());
              for (let identifier of identifiers) {
                try {
                  // console.log('identifier: ' + identifier)
                  configuration.connectors["data-el-text"][identifier].connect(
                    this,
                    element
                  );
                } catch (ex) {
                  console.log(ex);
                }
              }
              delete element.dataset.elText;
            }

            // Connect actions
            elements = [
              ...this.__shadow__.querySelectorAll("[data-el-action]"),
            ];
            for (let element of elements) {
              const identifiers = element.dataset.elAction
                .split(",")
                .map((el) => el.trim());
              for (let identifier of identifiers) {
                configuration.connectors["data-el-action"][identifier].setup(
                  this,
                  element
                );
              }
              delete element.dataset.elAction;
            }

            this.__setupOngoing__ = false;
            this.__setupComplete__ = true;
          }
        }
      }
    }

    Object.defineProperty(CompiledComponent, "name", {
      value: OriginalComponent.prototype.constructor.name + "Compiled",
    });
    return CompiledComponent;
  };

  if (!customElements[OriginalConfiguration.selector]) {
    customElements.define(
      OriginalConfiguration.selector,
      compile(OriginalComponent)
    );
  }
  return configuration;
};
