export function extractClassInfo(OriginalComponent,OriginalConfiguration){
      // Get it's properties //
  const methods = Object.getOwnPropertyNames(OriginalComponent.prototype);

  // Get template and map it's properties
  let props = {};
  let tmp = new OriginalComponent();
  Object.keys(tmp).filter(key => 
    key.indexOf('__') == -1 && ['template','selector'].indexOf(key) == -1
  ).forEach((key) => {
    
      props[key] = { type: typeof tmp[key], defaultValue: tmp[key] };
    
  });
  delete props.template;
  delete props.selector;
  delete props.prototype;

  let configuration = OriginalConfiguration
  configuration.props = props 

  return {methods,props,configuration}
}