export class TheComponent  {
  constructor() {
    
    // element created
  }

  __emitListeners__={}
  __addEmitListener__(eventName,listener,callback){
  
    eventName = eventName.toLowerCase();
    if(!this.__emitListeners__.hasOwnProperty(eventName)){
      this.__emitListeners__[eventName] = []
    }
    if(this.__emitListeners__[eventName].indexOf(listener) == -1){
      this.__emitListeners__[eventName].push(listener);
      listener.addEventListener(eventName, callback);
    }
  }
  emit(eventName,data){

    eventName = eventName.toLowerCase();
    // console.log(this,eventName)
    
    (this.__emitListeners__[eventName] || []).forEach(listener => {
      listener.dispatchEvent(new CustomEvent(eventName, {detail:{reference: this,data}}));
    })
    
  }
  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [
      /* array of attribute names to monitor for changes */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue !== newValue) {
      this[name] = newValue;
    }
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties

  // connectedCallback(){
  //     console.log('Demo connected')
  // }

  // attributeChangedCallback(name,oldValue,newValue){

  //     // Generated code
  //     if (oldValue === newValue) return;
  //     this[ property ] = newValue;
  //     console.log("Demo changed",{name:name,oldValue:oldValue,newValue:newValue});
  // }
}
export class TheBaseComponent extends HTMLElement {
    static observedAttributes = []
    constructor() {
      super();
      // element created
    }


    /**
     * Publically available method
     * @param {eventName} eventName 
     * @param {*} data 
     */     
    emit(eventName,data){
      eventName = eventName.toLowerCase();
      // console.log('EMIT',eventName);
      this.__emitListeners__[eventName].forEach(listener => {
        listener.dispatchEvent(new CustomEvent(eventName, {detail:{reference: this,data}}));
      })
      
    }

    // Track parent components for event emission
    __emitListeners__={}
    __addEmitListener__(eventName,listener,callback){

      eventName = eventName.toLowerCase();
      // console.log('ADD ',eventName)
      if(!this.__emitListeners__.hasOwnProperty(eventName)){
        this.__emitListeners__[eventName] = []
      }
      if(this.__emitListeners__[eventName].indexOf(listener) == -1){
        this.__emitListeners__[eventName].push(listener);
        listener.addEventListener(eventName, callback);
      }
    }

    connectedCallback() {
      // browser calls this method when the element is added to the document
      // (can be called many times if an element is repeatedly added/removed)
    }
  
    disconnectedCallback() {
      // browser calls this method when the element is removed from the document
      // (can be called many times if an element is repeatedly added/removed)
    }
  
    static get observedAttributes() {
      return [
        /* array of attribute names to monitor for changes */
      ];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      // called when one of attributes listed above is modified
    }
  
    adoptedCallback() {
      // called when the element is moved to a new document
      // (happens in document.adoptNode, very rarely used)
    }
  
    // there can be other element methods and properties
  
    // connectedCallback(){
    //     console.log('Demo connected')
    // }
  
    // attributeChangedCallback(name,oldValue,newValue){
  
    //     // Generated code
    //     if (oldValue === newValue) return;
    //     this[ property ] = newValue;
    //     console.log("Demo changed",{name:name,oldValue:oldValue,newValue:newValue});
    // }
  }