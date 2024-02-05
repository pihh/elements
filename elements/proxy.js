

export const SubscriptionManager = function (scope) {};

export const SplitTemplates = function (element) {};


let $body = document.body;
let $div = document.createElement("div");

const $template = `

<section class="bg-{{this.color}}-400  p-6 pb-8 rounded-xl border border-{{this.color}}-400 mx-auto mb-4 " style="max-width:36em">
<my-example></my-example>
<div class='{{this.className}}'>
    {{this.xxx}} {{this.isOpen}}
</div>
<div *if="this.isOpen">
    <h1>It's open!!</h1>
</div>
<button (click)="this.onToggle()" class="btn">toggle</button>
<div class='bg-{{this.color}}-300 rounded-xl p-2'>
    <p>Arg [0] -> {{this.arr[0]}}</p>
    <p>Obj.Arr [0] -> {{this.obj.arr[0]}}</p>

    {{this.xxx}} {{this.arr[0]}} {{this.obj.obj.x}} Text node content {{this.obj.arg}}   {{this.isOpen ? "it's open." : "it's closed."}}
    <button (click)='this.onClick($event,1)'>
        on click {{this.count}} 
    </button>
        {{this.xxx}}

        <div class="form-control">
            <label for="text">Text {{this.text}}</label>
            <input class="input" type='text' [model]="this.text" name="text" />
        </div>
        <div class="form-control">
            <label for="xxx">XXX {{this.xxx}}</label>
            <input class="input" type='text' [model]="this.xxx" name="xxx" />
        </div>
        <div class="form-control">
            <label for="arr[0]">State.arr[0] {{this.arr[0]}}</label>
            <input class="input" type='text' [model]="this.arr[0]" name="arr[0]" />
        </div>
        <div class="form-control">
            <label for="arr[0]">State.obj.obj.x {{this.obj.obj.x}} </label>
            <input class="input" type='text' [model]="this.obj.obj.x" name="obj.obj.x" />
        </div>
        <div class="form-control">
        <label for="color">Color {{this.color}}</label>
        <input class="input" type='text' [model]="this.color" name="color" />
    </div>
        <div class="form-control">
            <label for="color">Color {{this.color}} </label>
            <select class="input"  [model]="this.color" name="color" >
                <option value="{{option}}" *for="option of this.options">Red</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="indigo">Indigo</option>
            </select>
        </div>
        <div class="form-control">
            <label for="check">Check {{this.isOpen}} </label>
            <input type="checkbox"  [model]="this.isOpen" name="check" class="checkbox"/>
   
        </div>
        <div class="form-control">
            <label for="check">Check {{this.isSwitchOn}} </label>
            <input type="checkbox"  [model]="this.isSwitchOn" name="check" class="toggle"/>
       
        </div>
</div>`;

// $body.appendChild($div);
for(let $comp in  [1]){
    const $component = document.createElement('div');
    $component.innerHTML = '<my-example counter="10"></my-example>';

    // const $component = document.createElement("my-example");

    document.body.appendChild($component);
}

