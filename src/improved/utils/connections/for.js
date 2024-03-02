import { parseText } from "../eval";

export const connectFor = function (
  instance,
  baseElement,
  config,
  reactivityConfiguration
) {
  // console.log(connectFor(instance, baseElement, config))
  instance.localScope = { ...instance.localScope, ...config.localScope };

  let el = baseElement.querySelector(config.selector);
  let placeholder = document.createComment("for placeholder");
  let div = document.createElement("div");

  el.before(placeholder);
  div.appendChild(el);

  placeholder.__content = div;
  placeholder.__template = div.innerHTML;
  placeholder.__stack = [];

  placeholder.__generator = (i) => {
    if (placeholder.__stack[i]) return placeholder.__stack[i];

    let $wrapper = placeholder.__content.cloneNode(true);
    let $template = placeholder.__template;

    let listener = config.sourceVariable + "[" + i + "]";

    $template = $template
      .replaceAll(config.maskVariable, listener)
      .replaceAll("{{", "${")
      .replaceAll("}}", "}");
    $wrapper.innerHTML = $template;
    $wrapper = $wrapper.firstElementChild
    // console.log($template);
    const _configuration = Object.assign(
      {},
      JSON.parse(
        JSON.stringify(config.configuration).replaceAll(
          config.maskVariable,
          listener
        )
      )
    );
  // delete $wrapper.firstElementChild.dataset[config.selectorCamel];
    // console.log(_configuration, $wrapper);
        
    placeholder.after($wrapper);
    instance.connectElements(_configuration, $wrapper);
    
    // instance.connectElements(reactivityConfiguration, $wrapper);
    // $wrapper = $wrapper.firstElementChild;

    placeholder.__stack.push($wrapper);
    
    instance.update(listener)
    $wrapper.before($wrapper.firstElementChild);
  };

  const subscription = (expression) => {
    // placeholder.__stack.forEach(el => el.remove())
    // placeholder.__stack = [];
    // console.log(expression);
    const entries = Number(parseText(instance, expression));

    if (entries > placeholder.__stack.length) {
      for (let i = placeholder.__stack.length; i < entries; i++) {
        placeholder.__generator(i);
      }
    }
    if (entries < placeholder.__stack.length) {
      for (let i = entries; i < placeholder.__stack.length; i++) {
        placeholder.__stack[i].remove();
        instance.update(config.sourceVariable+"["+i+"]")
      }
      placeholder.__stack = placeholder.__stack.slice(0, entries);
    }
    
  };

  instance.subscribe(config.sourceVariable + ".length", function () {
    placeholder.forceRender()
    // subscription("${" + config.sourceVariable + ".length}");
    // instance.firstRender()
  });

  //   instance.firstRender()
  subscription("${" + config.sourceVariable + ".length}");
  placeholder.instance = instance;
  placeholder.forceRender = function(){
    try{

      placeholder.__stack.map(el => el.remove())
    }catch(ex){

    }
    placeholder.__stack = [...[]];
    console.log(placeholder,instance,config)
    subscription("${" + config.sourceVariable + ".length}");

  }
  console.log({placeholder});
};
