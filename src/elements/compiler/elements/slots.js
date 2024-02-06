export const CompileSlots = function (instance) {

  const template = new Map(
    Array.from(instance.querySelectorAll("slot").values()).map((i) => [i.name, i])
  );
  const context = Array.from(
    instance.querySelectorAll(":scope > *[slot]").values()
  ).map((i) => [i.slot, i]);
  for (const [slotName, element] of context) {
    const slot = template.get(slotName);
    if (slot) {
      element.removeAttribute('slot')
      slot.parentElement.replaceChild(element, slot);
     } 
  }
 
  // console.log({instance,template,context})
};
export const DisconnectSlots = function (instance) {

  Array.from(instance.querySelectorAll("slot")).forEach((el) => el.removeAttribute("slot"))
 

};
