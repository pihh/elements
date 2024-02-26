import { Reactive } from "../../signals/proxy";

export const State = function (state = {}) {
    let [scope, connect, render] = Reactive(state);
    return { scope, connect, render };
};