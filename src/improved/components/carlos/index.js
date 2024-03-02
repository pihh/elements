import { Compile } from "../../lib";
import template from "./template.html?raw";

class TeamCarlos {
  
  /**
   * Two way data binding properties.
   * Set up here your variables
   */
  welcome = "TeamCarlos works!!"; 
 
}


/**
 * Compiles the custom web component and registers it to be used in the DOM
 * 
 * @param {Component} Class to boilerplate the component functionality
 * @param {config} Configuration of the component
 * @reqired  @param {String} config.selector - web component unique selector
 * @reqired  @param {String|HTMLElement} config.template - HTML File or string containing the template with the boilerplate setup
 * @param {String|StyleSheet} config.styles - Stylesheet for the component
 * @param {Object} config.shadow - enables and configures shadow dom. Disabled by default
 */
Compile(TeamCarlos, {
  selector: "team-carlos",
  template: template,
});
