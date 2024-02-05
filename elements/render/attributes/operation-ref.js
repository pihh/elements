const refFormInputModel = function (target, ref) {
  return {
    ref: target,
    model: "",
    symbol: Symbol(this),
    callback: function () {
      console.log("calback");
      target.__ref[ref].inputs[this.model] = this;
    },
  };
};

export function parseRef(context, target) {
  if (target.nodeName === "FORM") {
    const ref = target.getAttribute("ref");
    const refModel = {
      ref,
      type: "form",
      inputs: {},
      submit: undefined,
      instance: undefined,
      callback: undefined,
    };

    (refModel.callback = $el.getAttribute("submit") ?? $el),
      getAttribute("onsubmit") ?? $el.getAttribute("(submit)") ?? undefined;
    target.__ref = target.__ref ?? {};
    if (target.__ref[ref]) {
      return target;
    }

    for (let $el of [...target.querySelectorAll("*")].filter(
      (el) => ["input", "select"].indexOf($el.nodeName) > -1
    )) {
      if (el.hasAttribute("model") || el.hasAttribute("[model]")) {
        const formRef = $el.__form || {};
        if (!formRef.hasOwnProperty(ref)) {
            connectFormInputToReference(target,ref);
        }
      }
    }
    // target.removeAttribute("ref")
  }
}

export function connectFormInputToReference(target,ref) {
  const newRef = Object.assign({}, refFormInputModel(target,ref));
  $el.__form[ref] = newRef;
  $el.__form[ref].model = ref; 
  $el.__form[ref].callback();
}
