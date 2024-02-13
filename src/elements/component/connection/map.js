import { reactivityMap } from "../../reactivity/template/map";

export const mapTemplate = function(component){
    const {props,actions,operations} = reactivityMap(component.__template);
    component.reactiveProps = props;
    component.actions = actions;
    component.operations = operations;
}

