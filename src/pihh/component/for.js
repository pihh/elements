class ForLoop extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['Apple','Banana','Strawberry','Ananas','Cherry'];
    len = 5;
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      while (this.ul.firstChild) this.ul.firstChild.remove();
      this.ul.append(...this.fruits.map(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
        li.appendChild(document.createElement('the-for'))
        return li;
      }));
    }

    attributeChangedCallback(name,oldValue,newValue) {
        let n = Number(newValue)
        if(n !== this.fruits.length) {
            if(n > this.fruits.length){
                while(this.fruits.length < n){
                    this.fruits.push('fruit '+ this.fruits.length)
                }
            }else{
                this.fruits = this.fruits.slice(0,n)
            }
        }
        this.render()
    }
  }
  class TheFor extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['A','B','C'];
    len = 3
    
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      while (this.ul.firstChild) this.ul.firstChild.remove();
      this.ul.append(...this.fruits.map(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
        return li;
      }));
    }

    attributeChangedCallback(name,oldValue,newValue) {
        let n = Number(newValue)
        if(n !== this.fruits.length) {
            if(n > this.fruits.length){
                while(this.fruits.length < n){
                    this.fruits.push('fruit '+ this.fruits.length)
                }
            }else{
                this.fruits = this.fruits.slice(0,n)
            }
        }
        this.render()
    }
  }
  


  customElements.define("the-for", TheFor);
  customElements.define("for-loop", ForLoop);