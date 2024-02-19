import { TheBaseComponent } from ".";
import { Component } from "../compiler";

const config = {
  selector: "the-child",
  template: `
    <style>
    h1 {
      font-weight: 800;
      font-size: 1.75rem;
      letter-spacing: -1px;
      line-height: 2rem;
  }</style>
              <h1 data-el-text="0">{{this.title}} inner</h1>
              <small data-el-text="1"><b>Counter:</b> {{this.counter}}</small>
              <input type="text" name="title" model="{{this.title}}" class="input"/>
              <button class="btn" data-el-action="0">Propagate</button>
              `,
};

class TheChildComponent extends TheBaseComponent {
  constructor() {
    super();
  }

  title = "The Inner Component";
  counter = 1;
  propagate() {
    this.emit("propagate", {
      name: "John",
      counter: this.counter,
    });
  }
}

//   export class TheChildComponent extends TheInnerComponent {
//     static get observedAttributes() {
//       return Object.keys(configuration.props);
//     }
//     constructor() {
//       super();
//       this.__init__();
//     }

//     connect() {
//       console.log("Connecting", ...arguments);
//     }

//     connectedCallback() {
//       super.connectedCallback();
//       this.__setup__();
//     }

//     disconnectedCallback() {
//       super.disconnectedCallback();
//       console.log("disconnected");
//     }

//     __connections__ = {};
//     __subscriptions__ = [];
//     __init__() {
//       // Add shadow root
//       if (this.shadowRoot) {
//         this.__shadow__ = this.shadowRoot;
//       } else {
//         this.__shadow__ = this.attachShadow({ mode: "open" });
//       }
//       this.__shadow__.innerHTML = configuration.template;

//       // Create reactivity
//       const __scope__ = {};
//       for (let prop of Object.keys(configuration.props)) {
//         let propConfiguration = configuration.props[prop];
//         __scope__[prop] = propConfiguration.defaultValue;
//       }

//       const { scope, connect, render } = State(__scope__);
//       this.__scope__ = scope;
//       this.connect = connect;
//       // Parse this shit
//       for (let prop of Object.keys(configuration.props)) {
//         this.__defineGetter__(prop, function () {
//           return this.__scope__[prop];
//         });
//         this.__defineSetter__(prop, function (value) {
//           this.__scope__[prop] = value;
//           return true;
//         });
//       }
//     }

//     __setup__() {
//       if (!this.__setupComplete__) {
//         if (!this.__setupOngoing__) {
//           this.__setupOngoing__ = true;

//           // Connect properties
//           for (let prop of Object.keys(configuration.props)) {
//             //this[prop] = this.getAttribute(prop) || this[prop];
//           }
//           // debugger;
//           // Connect reactivity
//           let elements = [];
//           elements = [...this.__shadow__.querySelectorAll("[data-el-attribute]")];
//           for (let element of elements) {
//             const identifiers = element.dataset.elAttribute
//               .split(",")
//               .map((el) => el.trim());
//             for (let identifier of identifiers) {
//               configuration.connectors["data-el-attribute"][identifier].connect(
//                 this,
//                 element
//               );
//             }
//             delete element.dataset.elAttribute;
//           }

//           elements = [...this.__shadow__.querySelectorAll("[data-el-text]")];
//           for (let element of elements) {
//             const identifiers = element.dataset.elText
//               .split(",")
//               .map((el) => el.trim());
//             for (let identifier of identifiers) {
//               try {
//                 configuration.connectors["data-el-text"][identifier].connect(
//                   this,
//                   element
//                 );
//               } catch (ex) {
//                 console.log;
//               }
//             }
//             delete element.dataset.elText;
//           }

//           // Connect actions
//           elements = [...this.__shadow__.querySelectorAll("[data-el-action]")];
//           for (let element of elements) {
//             const identifiers = element.dataset.elAction
//               .split(",")
//               .map((el) => el.trim());
//             for (let identifier of identifiers) {
//               configuration.connectors["data-el-action"][identifier].connect(
//                 this,
//                 element
//               );
//             }
//             delete element.dataset.elAction;
//           }

//           this.__setupOngoing__ = false;
//           this.__setupComplete__ = true;
//         }
//       }
//     }
//   }

Component(TheChildComponent, config);
