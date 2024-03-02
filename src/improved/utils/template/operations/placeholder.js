const ModelFor = `
<section data-el-operation-4 data-el-text-5>
    {{_color}} <b data-el-text-6>{{title}} {{colors[2]}}</b>
    <div >
      <input type="text" *value="_color" data-el-bind-3 />  
    </div>
  </section>
`

export const createPlaceholder = function(dataset,content){
    const $div = document.createElement('div');
    const $head = document.head;
    
    $head.appendChild($div)
    content = content.trim();
    
    $div.innerHTML = content;
    $div.firstElementChild.dataset[dataset.selectorCamel] = true;
    if(dataset.typeSelectorCamel){
        $div.firstElementChild.dataset[dataset.typeSelectorCamel] = true;
    }
  
    content = $div.innerHTML.trim()
    $div.remove();

    return content;
}