const createComment = function(parent){
  let content = Math.random();
  let $comment = document.createComment(content);
  parent.before($comment)
  return $comment
}
class ForLoop extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['Apple','Banana','Strawberry','Ananas','Cherry'];
    len = 5;
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
      this.$comment = createComment(this)
   
      this.$comment.stack = [];
      this.$comment.generate = (i)=>{
        let $wrapper = document.createElement('div');
        let $child = document.createElement('h1');
        let $for = document.createElement('the-for');
        $child.innerText = "Loop item #"+this.$comment.stack.length;
        $wrapper.appendChild($child);
        $wrapper.appendChild($for);
        this.$comment.before($wrapper);
        this.$comment.stack.push($wrapper);

      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      while (this.ul.firstChild) {
        this.ul.firstChild.remove();
        this.$comment.stack[this.$comment.stack.length - 1].remove();
      }
      this.ul.append(...this.fruits.map(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
    
        this.$comment.generate(1)
        return li;
      }));
    }

    attributeChangedCallback(name,oldValue,newValue) {
        let n = Number(newValue)
        if(n !== this.fruits.length) {
            if(n > this.fruits.length){
                while(this.fruits.length < n){
                    this.fruits.push('fruit '+ this.fruits.length)
                    this.$comment.generate(this.fruits.length)
                }
            }else{
                this.fruits = this.fruits.slice(0,n)
                let $remove = this.$comment.stack.slice(n)
                $remove.forEach($r => $r.remove())
            }
        }

        this.render()
    }
  }

  /*
  class TheFor extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['A','B','C'];
    len = 3
    
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
      this.$comment = createComment(this)
      
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
  */
  class TheFor extends HTMLElement {
    static observedAttributes = ["fruits","len"]
    ul = document.createElement('ul');
    fruits = ['Apple','Banana','Strawberry','Ananas','Cherry'];
    len = 5;
    constructor() {
      super().attachShadow({mode: 'open'}).append(this.ul);
      this.$comment = createComment(this)
   
      this.$comment.stack = [];
      this.$comment.generate = (i)=>{
        let $wrapper = document.createElement('div');
        let $child = document.createElement('h1');
        $child.innerText = "Loop item #"+this.$comment.stack.length;
        $wrapper.appendChild($child);
        this.$comment.before($wrapper);
        this.$comment.stack.push($wrapper);
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      while (this.ul.firstChild) {
        this.ul.firstChild.remove();
        this.$comment.stack[this.$comment.stack.length - 1].remove();
      }
      this.ul.append(...this.fruits.map(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
       
        this.$comment.generate(1)
        return li;
      }));
    }

    attributeChangedCallback(name,oldValue,newValue) {
        let n = Number(newValue)
        if(n !== this.fruits.length) {
            if(n > this.fruits.length){
                while(this.fruits.length < n){
                    this.fruits.push('fruit '+ this.fruits.length)
                    this.$comment.generate(this.fruits.length)
                }
            }else{
                this.fruits = this.fruits.slice(0,n)
                let $remove = this.$comment.stack.slice(n)
                $remove.forEach($r => $r.remove())
            }
        }

        this.render()
    }
  }


  customElements.define("the-for", TheFor);
  customElements.define("for-loop", ForLoop);