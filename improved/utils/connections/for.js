import { parseText } from "../eval";

export const connectFor = function (
  instance,
  baseElement,
  config,
  reactivityConfiguration
) {
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
/*
    console.log("before", _configuration);
    debugger;
    for (let key of Object.keys(_configuration)) {
      // console.log(_configuration[key]);
      _configuration[key].listeners = _configuration[key].listeners || [];
      _configuration[key].listeners = _configuration[key].listeners.map(
        (listener) =>
          listener
            .replaceAll("[", ".")
            .replaceAll("]", ".")
            .split(".")
            .filter((el) => el.length > 0)
            .join(".")
      );
    }
*/
    // console.log(_configuration,'after',$wrapper);
    // debugger
    delete $wrapper.firstElementChild.dataset[config.selectorCamel];
    // console.log(_configuration, $wrapper);

    placeholder.after($wrapper);
    instance.connectElements(_configuration, $wrapper);
    // instance.connectElements(reactivityConfiguration, $wrapper);
    // $wrapper = $wrapper.firstElementChild;

    placeholder.__stack.push($wrapper);
    
    instance.update(listener)
  };

  const subscription = (expression) => {
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
    subscription("${" + config.sourceVariable + ".length}");
    // instance.firstRender()
  });

  //   instance.firstRender()
  subscription("${" + config.sourceVariable + ".length}");
};
