import { Reactive } from "../proxy/reactivity";

export const State = function (state = {}) {

    let [scope, connect, render] = Reactive(state);
    return { scope, connect, render };
};