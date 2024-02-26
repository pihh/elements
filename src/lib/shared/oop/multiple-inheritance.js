class BaseClass extends HTMLElement{
    constructor(){super()}
}
// SocialNetworkMixin
const SocialNetwork = (superclass) => class extends superclass {
    foo() {
        console.log('foo');
    }
}
// AdProviderMixin
const AdProvider = (superclass) => class extends superclass {
    bar() {
        console.log('bar');
    }
}
// Our helper class that will make things look better
class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}
// this will combine everything in one class
const mix = (superclass) => new MixinBuilder(superclass);

class Facebook extends mix(BaseClass).with(SocialNetwork, AdProvider) {
    constructor(){super();  }
    connectedCallback(){
        this.innerHTML = "<h1>Fb class</h1>"
    }
}

/**
 * Full Example
 *
class BaseClass { }
// SocialNetworkMixin
const SocialNetwork = (superclass) => class extends superclass {
    foo() {
        console.log('foo');
    }
}
// AdProviderMixin
const AdProvider = (superclass) => class extends superclass {
    bar() {
        console.log('bar');
    }
}
// Our helper class that will make things look better
class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}
// this will combine everything in one class
const mix = (superclass) => new MixinBuilder(superclass);

class Facebook extends mix(BaseClass).with(SocialNetwork, AdProvider) {}
const fb = new Facebook();
fb.foo();
fb.bar();

*/